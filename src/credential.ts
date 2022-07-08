import { Certificate } from './certificate';
import { PrivateKey } from './private-key';
import { SignatureAlgorithm } from './signature-algorithm';

export class Credential {
    private readonly _certificate: Certificate;

    private readonly _privateKey: PrivateKey;

    /**
     * Credential constructor
     *
     * @param certificate - Certificate Instance
     * @param privateKey - PrivateKey instance
     * @throws {@link Error} Exception Certificate does not belong to private key
     */
    constructor(certificate: Certificate, privateKey: PrivateKey) {
        if (!privateKey.belongsTo(certificate)) {
            throw new SyntaxError('Certificate does not belong to private key');
        }
        this._certificate = certificate;
        this._privateKey = privateKey;
    }

    /**
     * Create a Credential object based on string contents
     *
     * The certificate content can be X.509 PEM, X.509 DER or X.509 DER base64
     * The private key content can be PKCS#8 DER, PKCS#8 PEM or PKCS#5 PEM
     *
     * @param certificateContents - content can be X.509 PEM, X.509 DER or X.509 DER base64
     * @param privateKeyContents - content can be PKCS#8 DER, PKCS#8 PEM or PKCS#5 PEM
     * @param passPhrase - password for encrypted key
     */
    public static create(certificateContents: string, privateKeyContents: string, passPhrase: string): Credential {
        const certificate = new Certificate(certificateContents);
        const privateKey = new PrivateKey(privateKeyContents, passPhrase);

        return new Credential(certificate, privateKey);
    }

    /**
     * Create a Credential object based on local files (Only works with Node Environment)
     *
     * File paths must be local, can have no schema or file:// schema
     * The certificate file content can be X.509 PEM, X.509 DER or X.509 DER base64
     * The private key content can be PKCS#8 DER, PKCS#8 PEM or PKCS#5 PEM
     *
     * @param certificateFile - filename of certificate
     * @param privateKeyFile - filename of private key
     * @param passPhrase - password
     *
     * This function only works in Node.js.
     */
    public static openFiles(certificateFile: string, privateKeyFile: string, passPhrase: string): Credential {
        const certificate = Certificate.openFile(certificateFile);
        const privateKey = PrivateKey.openFile(privateKeyFile, passPhrase);

        return new Credential(certificate, privateKey);
    }

    public certificate(): Certificate {
        return this._certificate;
    }

    public privateKey(): PrivateKey {
        return this._privateKey;
    }

    public rfc(): string {
        return this._certificate.rfc();
    }

    public legalName(): string {
        return this._certificate.legalName();
    }

    public isFiel(): boolean {
        return this._certificate.satType().isFiel();
    }

    public isCsd(): boolean {
        return this._certificate.satType().isCsd();
    }

    /**
     * Sign string data by provider algorithm
     *
     * @param data - input data
     * @param algorithm - algorithm to be used
     * @returns Hexadecimal string signature
     */
    public sign(data: string, algorithm = SignatureAlgorithm.SHA256): string {
        return this._privateKey.sign(data, algorithm);
    }

    /**
     * Verify string data is signed by current private key
     *
     * @param data - Original string data
     * @param signature - Hexadecimal string signature
     * @param algorithm - Algorithm to be used
     */
    public verify(data: string, signature: string, algorithm = SignatureAlgorithm.SHA256): boolean {
        return this._certificate.publicKey().verify(data, signature, algorithm);
    }
}
