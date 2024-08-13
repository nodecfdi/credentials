import { DateTime } from 'luxon';
import forge from 'node-forge';
import PublicKey from '#src/base/public_key';
import DataArray from '#src/internal/data_array';
import Rfc4514 from '#src/internal/rfc4514';
import { SatType, SatTypeEnum } from '#src/internal/sat_type';
import PemExtractor from '#src/pem_extractor';
import SerialNumber from '#src/serial_number';

export default class Certificate extends DataArray {
  /** String PEM contents including headers */
  private readonly _pem: string;

  /** String RFC as parsed from subject/uniqueIdentifier */
  private readonly _rfc: string;

  /** String Legal name as parsed from subject/uniqueIdentifier */
  private readonly _legalName: string;

  /** Parsed serial number */
  private _serialNumber?: SerialNumber;

  /** Parsed public key */
  private _publicKey?: PublicKey;

  public constructor(contents: string) {
    super();
    if (contents === '') {
      throw new SyntaxError('Create certificate from empty contents');
    }

    let pem = new PemExtractor(contents).extractCertificate();
    if (pem === '') {
      pem = Certificate.convertDerToPem(contents);
    }

    let parsed: forge.pki.Certificate;
    try {
      parsed = forge.pki.certificateFromPem(pem);
    } catch (error) {
      throw new Error(`Cannot parse X509 certificate from contents ${(error as Error).message}`);
    }

    this._pem = pem;
    this._dataArray = {
      version: parsed.version,
      serialNumber: parsed.serialNumber,
      subject: parsed.subject,
      issuer: parsed.issuer,
      extensions: parsed.extensions,
      validity: parsed.validity,
    };
    this._rfc = forge.util.decodeUtf8(
      (this.subjectData({ type: '2.5.4.45' })?.value as string).split(' ')[0],
    );
    this._legalName = this.subjectData({ type: '2.5.4.41' })?.value as string;
    this._dataArray.hash = parsed.issuer.hash;
    this._dataArray.signatureTypeLN = parsed.signature;
  }

  /**
   * Convert X.509 DER base64 or X.509 DER to X509 PEM
   *
   * @param contents - DER Content
   */
  public static convertDerToPem(contents: string): string {
    let finalContent = contents;
    // Effectively compare that all the content is base64, if it isn't then encode it
    if (finalContent !== forge.util.encode64(forge.util.decode64(finalContent))) {
      finalContent = forge.util.encode64(finalContent);
    }

    return [
      '-----BEGIN CERTIFICATE-----\n',
      `${finalContent.match(/.{1,64}/g)!.join('\n')}\n`,
      '-----END CERTIFICATE-----',
    ].join('');
  }

  public pem(): string {
    return this._pem;
  }

  public pemAsOneLine(): string {
    const normaliceEnds = this.pem().replaceAll('\r\n', '\n');
    const allLines = normaliceEnds.split(/\n/);
    const filterLines = allLines.filter((s) => /^(?:(?!-).)*$/.test(s));

    return filterLines.join('');
  }

  public parsed(): Record<string, unknown> {
    return this._dataArray;
  }

  public rfc(): string {
    return this._rfc;
  }

  public legalName(): string {
    return this._legalName;
  }

  public branchName(): string {
    return (this.subjectData({ shortName: 'OU' })?.value as string | undefined) ?? '';
  }

  public name(): string {
    return forge.util.decodeUtf8(
      `/CN=${(this.subjectData({ shortName: 'CN' })?.value as string | undefined) ?? ''}`,
    );
  }

  public subject(): forge.pki.Certificate['subject'] {
    return this.extractArray('subject') as forge.pki.Certificate['subject'];
  }

  public subjectData(
    key: string | forge.pki.CertificateFieldOptions,
  ): forge.pki.CertificateField | undefined {
    return this.subject().getField(key) as forge.pki.CertificateField;
  }

  public hash(): string {
    return this.extractString('hash');
  }

  public issuer(): forge.pki.Certificate['issuer'] {
    return this.extractArray('issuer') as forge.pki.Certificate['issuer'];
  }

  public issuerData(key: string | forge.pki.CertificateFieldOptions): forge.pki.CertificateField {
    return this.issuer().getField(key) as forge.pki.CertificateField;
  }

  public version(): string {
    return this.extractString('version');
  }

  public serialNumber(): SerialNumber {
    if (!this._serialNumber) {
      const serial = this.extractString('serialNumber');
      this._serialNumber = this.createSerialNumber(serial, '');
    }

    return this._serialNumber;
  }

  public validity(): forge.pki.Certificate['validity'] {
    return this.extractArray('validity') as forge.pki.Certificate['validity'];
  }

  public validFrom(): Date {
    return this.validity().notBefore;
  }

  public validTo(): Date {
    return this.validity().notAfter;
  }

  public validFromDateTime(): DateTime {
    return DateTime.fromJSDate(this.validFrom());
  }

  public validToDateTime(): DateTime {
    return DateTime.fromJSDate(this.validTo());
  }

  public signatureTypeLN(): string {
    return this.extractString('signatureTypeLN');
  }

  public extensions(): Record<string, unknown>[] {
    return this._dataArray.ext as Record<string, unknown>[];
  }

  public publicKey(): PublicKey {
    if (!this._publicKey) {
      // The public key can be created from PUBLIC KEY or CERTIFICATE
      this._publicKey = new PublicKey(this.pem());
    }

    return this._publicKey;
  }

  public satType(): SatTypeEnum {
    if (this.branchName() === '') {
      return new SatTypeEnum(SatType.FIEL);
    }

    return new SatTypeEnum(SatType.CSD);
  }

  public validOn(datetime?: DateTime): boolean {
    let dateTime = datetime;
    if (!dateTime) {
      dateTime = DateTime.now();
    }

    return (
      dateTime.toMillis() >= this.validFromDateTime().toMillis() &&
      dateTime.toMillis() <= this.validToDateTime().toMillis()
    );
  }

  public issuerAsRfc4514(): string {
    const issuer: Record<string, string> = {};
    const rawIssuer = this.issuer();
    for (const line of Object.values(rawIssuer.attributes)) {
      /* istanbul ignore if: on certs not pass but library check for undefined -- @preserve */
      if (!line.shortName && !line.type) {
        continue;
      }

      const keyIssuer: string = line.shortName ?? line.type!;
      issuer[keyIssuer] = forge.util.decodeUtf8(line.value as string);
    }

    return new Rfc4514().escapeRecord(issuer);
  }

  protected createSerialNumber(hexadecimal: string, decimal: string): SerialNumber {
    if (hexadecimal !== '') {
      return SerialNumber.createFromHexadecimal(hexadecimal);
    }

    if (decimal !== '') {
      // In some cases openssl report serialNumberHex on serialNumber
      if (decimal.slice(0, 2).toLowerCase() === '0x'.toLowerCase()) {
        return SerialNumber.createFromHexadecimal(decimal.slice(2));
      }

      return SerialNumber.createFromDecimal(decimal);
    }

    throw new Error('Certificate does not contain a serial number');
  }
}
