import { DateTime } from 'luxon';
import { pki, util } from 'node-forge';
import { Mixin } from 'ts-mixer';
import { DataArrayTrait } from './internal/data-array-trait.js';
import { LocalFileOpenTrait } from './internal/local-file-open-trait.js';
import { Rfc4514 } from './internal/rfc4514.js';
import { SatType, SatTypeEnum } from './internal/sat-type-enum.js';
import { PemExtractor } from './pem-extractor.js';
import { PublicKey } from './public-key.js';
import { SerialNumber } from './serial-number.js';

export class Certificate extends Mixin(DataArrayTrait, LocalFileOpenTrait) {
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

    constructor(contents: string) {
        super();
        if (contents === '') {
            throw new SyntaxError('Create certificate from empty contents');
        }

        let pem = new PemExtractor(contents).extractCertificate();
        if (pem === '') {
            pem = Certificate.convertDerToPem(contents);
        }

        let parsed: pki.Certificate;
        try {
            parsed = pki.certificateFromPem(pem);
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
        this._rfc = util.decodeUtf8(`${this.subjectData({ type: '2.5.4.45' })?.value as string}`.split(' ')[0]);
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
        // Effectively compare that all the content is base64, if it isn't then encode it
        if (contents !== util.encode64(util.decode64(contents))) {
            contents = util.encode64(contents);
        }

        return [
            '-----BEGIN CERTIFICATE-----\n',
            `${(contents.match(/.{1,64}/g) ?? []).join('\n')}\n`,
            '-----END CERTIFICATE-----',
        ].join('');
    }

    /**
     * Create a Certificate object by opening a local file
     * The content file can be a certificate format X.509 PEM, X.509 DER or X.509 DER base64
     *
     * @param filename - file name to be read
     *
     * This function only works in Node.js.
     */
    public static openFile(filename: string): Certificate {
        return new Certificate(Certificate.localFileOpen(filename));
    }

    public pem(): string {
        return this._pem;
    }

    public pemAsOneLine(): string {
        const normaliceEnds = this.pem().replaceAll('\r\n', '\n');
        const allLines = normaliceEnds.split(/\n/);
        const filterLines = allLines.filter((s) => /^((?!-).)*$/.test(s));

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
        return util.decodeUtf8(`/CN=${(this.subjectData({ shortName: 'CN' })?.value as string | undefined) ?? ''}`);
    }

    public subject(): pki.Certificate['subject'] {
        return this.extractArray('subject') as pki.Certificate['subject'];
    }

    public subjectData(key: string | pki.CertificateFieldOptions): pki.CertificateField | undefined {
        return this.subject().getField(key) as pki.CertificateField;
    }

    public hash(): string {
        return this.extractString('hash');
    }

    public issuer(): pki.Certificate['issuer'] {
        return this.extractArray('issuer') as pki.Certificate['issuer'];
    }

    public issuerData(key: string | pki.CertificateFieldOptions): pki.CertificateField {
        return this.issuer().getField(key) as pki.CertificateField;
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

    public validity(): pki.Certificate['validity'] {
        return this.extractArray('validity') as pki.Certificate['validity'];
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

    public extensions(): Array<Record<string, unknown>> {
        return this._dataArray.ext as Array<Record<string, unknown>>;
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
        if (!datetime) {
            datetime = DateTime.now();
        }

        return (
            datetime.toMillis() >= this.validFromDateTime().toMillis() &&
            datetime.toMillis() <= this.validToDateTime().toMillis()
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

            issuer[line.shortName ?? line.type ?? ''] = util.decodeUtf8(line.value as string);
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
