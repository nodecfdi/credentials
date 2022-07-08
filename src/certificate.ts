import { Mixin } from 'ts-mixer';
import { b64utos, KJUR, newline_toUnix, stob64, X509, zulutodate } from 'jsrsasign';
import { DateTime } from 'luxon';

import { DataRecordTrait } from './internal/data-record-trait';
import { LocalFileOpenTrait } from './internal/local-file-open-trait';
import { SerialNumber } from './serial-number';
import { PublicKey } from './public-key';
import { PemExtractor } from './pem-extractor';
import { SatType, SatTypeEnum } from './internal/sat-type-enum';
import { Rfc4514 } from './internal/rfc4514';

class Certificate extends Mixin(LocalFileOpenTrait, DataRecordTrait) {
    /** string PEM contents including headers */
    private readonly _pem: string;

    /** string RFC as parsed from subject/uniqueIdentifier */
    private readonly _rfc: string;

    /** string Legal name as parsed from subject/uniqueIdentifier */
    private readonly _legalName: string;

    /** Parsed serial number */
    private _serialNumber?: SerialNumber;

    /** Parsed public key */
    private _publicKey?: PublicKey;

    constructor(contents: string) {
        super();
        if ('' === contents) {
            throw new SyntaxError('Create certificate from empty contents');
        }
        let pem = new PemExtractor(contents).extractCertificate();
        if ('' == pem) {
            pem = Certificate.convertDerToPem(contents);
        }

        const parsed = new X509();
        try {
            parsed.readCertPEM(pem);
        } catch (e) {
            throw new Error(`Cannot parse X509 certificate from contents ${(e as Error).message}`);
        }
        this._pem = pem;
        this.dataRecord = (parsed as unknown as { getParam(): Record<string, unknown> }).getParam();
        this._rfc = `${this.subjectData('uniqueIdentifier')} `.split(' ')[0];
        this._legalName = this.subjectData('2.5.4.41');
        this.dataRecord.hash = KJUR.crypto.Util.hashHex(parsed.hex, 'sha1');
        this.dataRecord.signatureTypeLN = parsed.getSignatureAlgorithmName();
    }

    /**
     * Convert X.509 DER base64 or X.509 DER to X509 PEM
     *
     * @param contents - DER Content
     */
    public static convertDerToPem(contents: string): string {
        // effectively compare that all the content is base64, if it isn't then encode it
        if (contents !== stob64(b64utos(contents))) {
            contents = stob64(contents);
        }

        return [
            '-----BEGIN CERTIFICATE-----\n',
            `${(contents.match(/.{1,64}/g) || []).join('\n')}\n`,
            '-----END CERTIFICATE-----'
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
        const normaliceEnds = newline_toUnix(this.pem());
        const allLines = normaliceEnds.split(/\n/);
        const filterLines = allLines.filter((s) => /^((?!-).)*$/.test(s));

        return filterLines.join('');
    }

    public parsed(): Record<string, unknown> {
        return this.dataRecord;
    }

    public rfc(): string {
        return this._rfc;
    }

    public legalName(): string {
        return this._legalName;
    }

    public branchName(): string {
        return this.subjectData('OU');
    }

    public name(): string {
        return `${this.extractObject('subject').str}`;
    }

    public subject(): Array<Array<{ type: string; value: string; ds?: string }>> {
        return this.extractObject('subject').array as Array<Array<{ type: string; value: string; ds?: string }>>;
    }

    public subjectData(key: string): string {
        return this.findValueOnX500Array(this.subject(), key);
    }

    public hash(): string {
        return this.extractString('hash');
    }

    public issuer(): Array<Array<{ type: string; value: string; ds?: string }>> {
        return this.extractObject('issuer').array as Array<Array<{ type: string; value: string; ds?: string }>>;
    }

    public issuerData(key: string): string {
        return this.findValueOnX500Array(this.issuer(), key);
    }

    public version(): string {
        return this.extractString('version');
    }

    public serialNumber(): SerialNumber {
        if (!this._serialNumber) {
            const serialObj = this.extractObjectStrings('serial');
            this._serialNumber = this.createSerialNumber(serialObj.hex, serialObj.str);
        }

        return this._serialNumber;
    }

    public validFrom(): string {
        return this.extractString('notbefore');
    }

    public validTo(): string {
        return this.extractString('notafter');
    }

    public validFromDateTime(): DateTime {
        return DateTime.fromJSDate(zulutodate(this.validFrom()));
    }

    public validToDateTime(): DateTime {
        return DateTime.fromJSDate(zulutodate(this.validTo()));
    }

    public signatureTypeLN(): string {
        return this.extractString('signatureTypeLN');
    }

    public extensions(): Array<Record<string, unknown>> {
        return this.dataRecord.ext as Array<Record<string, unknown>>;
    }

    public publicKey(): PublicKey {
        if (!this._publicKey) {
            // The public key can be created from PUBLIC KEY or CERTIFICATE
            this._publicKey = new PublicKey(this.pem());
        }

        return this._publicKey;
    }

    public satType(): SatTypeEnum {
        if ('' == this.branchName()) {
            return new SatTypeEnum(SatType.FIEL);
        }

        return new SatTypeEnum(SatType.CSD);
    }

    public validOn(datetime: DateTime | null = null): boolean {
        if (!datetime) {
            datetime = DateTime.now();
        }

        return (
            datetime.toMillis() >= this.validFromDateTime().toMillis() &&
            datetime.toMillis() <= this.validToDateTime().toMillis()
        );
    }

    protected createSerialNumber(hexadecimal: string, decimal: string): SerialNumber {
        if ('' !== hexadecimal) {
            return SerialNumber.createFromHexadecimal(hexadecimal);
        }
        if ('' !== decimal) {
            // in some cases openssl report serialNumberHex on serialNumber
            if (decimal.substring(0, 2).toLowerCase() === '0x'.toLowerCase()) {
                return SerialNumber.createFromHexadecimal(decimal.slice(2));
            }

            return SerialNumber.createFromDecimal(decimal);
        }
        throw new Error('Certificate does not contain a serial number');
    }

    public issuerAsRfc4514(): string {
        const issuer: Record<string, string> = {};
        const rawIssuer = this.issuer();
        rawIssuer.forEach((line) => {
            line.forEach((rdn) => {
                issuer[rdn.type] = rdn.value;
            });
        });

        return new Rfc4514().escapeRecord(issuer);
    }

    private findValueOnX500Array(
        subjectArray: Array<Array<{ type: string; value: string; ds?: string }>>,
        target: string
    ): string {
        const RDN = subjectArray.find((x) => {
            return x.find((rdn) => rdn.type === target);
        });
        if (RDN) {
            return (RDN.find((rdn) => rdn.type === target) || { value: '' }).value;
        }

        return '';
    }
}

export { Certificate };
