import forge from 'node-forge';
import { Mixin } from 'ts-mixer';
import { type Certificate } from './certificate.js';
import { KeyTrait } from './internal/key-trait.js';
import { KeyType } from './internal/key-type-enum.js';
import { LocalFileOpenTrait } from './internal/local-file-open-trait.js';
import { PemExtractor } from './pem-extractor.js';
import { PublicKey } from './public-key.js';

export class PrivateKey extends Mixin(KeyTrait, LocalFileOpenTrait) {
    /** String PEM contents of private key  */
    private readonly _pem: string;

    /** String password of private key */
    private readonly _passPhrase: string;

    /** Public key extracted from private key **/
    private _publicKey?: PublicKey;

    /**
     * Private key constructor
     *
     * @param source - can be a PKCS#8 DER, PKCS#8 PEM or PKCS#5 PEM
     * @param passPhrase - if empty asume unencrypted/plain private key
     */
    constructor(source: string, passPhrase: string) {
        super();
        if (source === '') {
            throw new SyntaxError('Private key is empty');
        }

        const pemExtractor = new PemExtractor(source);
        let pem = pemExtractor.extractPrivateKey();
        if (pem === '') {
            // It could be a DER content, convert to PEM
            const convertSourceIsEncrypted = passPhrase !== '';
            pem = PrivateKey.convertDerToPem(source, convertSourceIsEncrypted);
        }

        this._pem = pem;
        this._passPhrase = passPhrase;
        this._dataArray = this.callOnPrivateKey((privateKey): Record<string, unknown> => {
            const data: Record<string, unknown> = {};
            const pubKey = forge.pki.setRsaPublicKey(privateKey.n, privateKey.e);
            data.bits = privateKey.n.bitLength();
            data.key = forge.pki.publicKeyToPem(pubKey);
            data[KeyType.RSA] = privateKey;
            data.type = KeyType.RSA;
            return data;
        });
    }

    /**
     * Convert PKCS#8 DER to PKCS#8 PEM
     *
     * @param contents -
     * @param isEncrypted -
     */
    public static convertDerToPem(contents: string, isEncrypted: boolean): string {
        const privateKeyName = isEncrypted ? 'ENCRYPTED PRIVATE KEY' : 'PRIVATE KEY';

        return [
            `-----BEGIN ${privateKeyName}-----\n`,
            `${(forge.util.encode64(contents).match(/.{1,64}/g) ?? []).join('\n')}\n`,
            `-----END ${privateKeyName}-----`,
        ].join('');
    }

    /**
     * Create a PrivateKey object by opening a local file
     * The content file can be a PKCS#8 DER, PKCS#8 PEM OR PKCS#5 PEM
     *
     * @param filename - file name to be read
     * @param passPhrase - if file is encrypted
     *
     * This function only works in Node.js.
     */
    public static openFile(filename: string, passPhrase: string): PrivateKey {
        return new PrivateKey(PrivateKey.localFileOpen(filename), passPhrase);
    }

    public pem(): string {
        return this._pem;
    }

    public passPhrase(): string {
        return this._passPhrase;
    }

    public publicKey(): PublicKey {
        if (!this._publicKey) {
            this._publicKey = new PublicKey(this.publicKeyContents());
        }

        return this._publicKey;
    }

    /**
     * Sign string data by provider algorithm
     *
     * @param data - input data
     * @param algorithm - algorithm to be used
     * @returns binary string signature
     */
    public sign(data: string, algorithm: 'md5' | 'sha1' | 'sha256' | 'sha384' | 'sha512' = 'sha256'): string {
        if (data.length === 0) {
            throw new Error('Cannot sign data: empty signature');
        }

        return this.callOnPrivateKey((privateKey) => {
            try {
                const sig = forge.md[algorithm].create();
                sig.update(data);

                return privateKey.sign(sig);
            } catch {
                /* istanbul ignore next: really dificult fail sign process -- @preserve */
                throw new Error('Cannot sign data: empty signature');
            }
        });
    }

    public belongsTo(certificate: Certificate): boolean {
        return this.belongsToPEMCertificate(certificate.pem());
    }

    public belongsToPEMCertificate(certificate: string): boolean {
        const pubKey = forge.pki.publicKeyFromPem(this.publicKeyContents()); // Or certificate
        const x = forge.pki.certificateFromPem(certificate);
        const certPubKey = x.publicKey;

        return JSON.stringify(certPubKey) === JSON.stringify(pubKey);
    }

    public callOnPrivateKey<T>(callableFunction: (prv: forge.pki.rsa.PrivateKey) => T): T {
        let privateKey: forge.pki.rsa.PrivateKey | undefined;
        try {
            privateKey = forge.pki.decryptRsaPrivateKey(this._pem, this._passPhrase);
        } catch (error) {
            throw new Error(`Cannot open private key: ${(error as Error).message}`);
        }

        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- Its necesary because forge not break on error.
        if (!privateKey) {
            throw new Error('Cannot open private key: invalid key or password');
        }

        return callableFunction(privateKey);
    }
}
