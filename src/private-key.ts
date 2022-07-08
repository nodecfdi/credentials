import { BigInteger, KEYUTIL, KJUR, RSAKey, stob64, X509 } from 'jsrsasign';
import { Mixin } from 'ts-mixer';

import { Key } from './internal/key';
import { LocalFileOpenTrait } from './internal/local-file-open-trait';
import { PublicKey } from './public-key';
import { SignatureAlgorithm } from './signature-algorithm';
import { PemExtractor } from './pem-extractor';
import { KeyType } from './internal/key-type-enum';
import { Certificate } from './certificate';

export class PrivateKey extends Mixin(Key, LocalFileOpenTrait) {
    /** string PEM contents of private key  */
    private readonly _pem: string;

    /** string password of private key */
    private readonly _passPhrase: string;

    /** public key extracted from private key **/
    private _publicKey?: PublicKey;

    /**
     * Private key constructor
     *
     * @param source - can be a PKCS#8 DER, PKCS#8 PEM or PKCS#5 PEM
     * @param passPhrase - if empty asume unencrypted/plain private key
     */
    constructor(source: string, passPhrase: string) {
        super({});
        if ('' === source) {
            throw new SyntaxError('Private key is empty');
        }
        const pemExtractor = new PemExtractor(source);
        let pem = pemExtractor.extractPrivateKey();
        if ('' == pem) {
            // it could be a DER content, convert to PEM
            const convertSourceIsEncrypted = '' !== passPhrase;
            pem = PrivateKey.convertDerToPem(source, convertSourceIsEncrypted);
        }
        this._pem = pem;
        this._passPhrase = passPhrase;
        this.dataRecord = this.callOnPrivateKey((privateKey): Record<string, unknown> => {
            const data: Record<string, unknown> = {};
            const privKeyJWK = KEYUTIL.getJWKFromKey(privateKey);
            const { e, kty, n } = privKeyJWK;
            const pubKey = KEYUTIL.getKey({ e, kty, n });

            data['bits'] = (privateKey as unknown as { n: BigInteger }).n.bitLength();
            data['key'] = KEYUTIL.getPEM(pubKey);
            data[KeyType.RSA] = privateKey;
            data['type'] = KeyType.RSA;

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
            `${(stob64(contents).match(/.{1,64}/g) || []).join('\n')}\n`,
            `-----END ${privateKeyName}-----`
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

    public sign(data: string, algorithm: SignatureAlgorithm = SignatureAlgorithm.SHA256): string {
        return this.callOnPrivateKey((privateKey) => {
            try {
                const sig = new KJUR.crypto.Signature({ alg: algorithm });
                sig.init(privateKey);
                sig.updateString(data);

                return sig.sign();
            } catch (e) {
                throw new Error('Cannot sign data: empty signature');
            }
        });
    }

    public belongsTo(certificate: Certificate): boolean {
        return this.belongsToPEMCertificate(certificate.pem());
    }

    public belongsToPEMCertificate(certificate: string): boolean {
        const pubKey = KEYUTIL.getKey(this.publicKeyContents()); // or certificate
        const x = new X509();
        x.readCertPEM(certificate);
        const certPubKey = x.getPublicKey();

        return JSON.stringify(certPubKey) === JSON.stringify(pubKey);
    }

    public callOnPrivateKey<T>(callableFunction: (prv: RSAKey) => T): T {
        let privateKey: RSAKey | KJUR.crypto.DSA | KJUR.crypto.ECDSA | undefined = undefined;
        try {
            privateKey = KEYUTIL.getKey(this._pem, this._passPhrase);
        } catch (e) {
            throw new Error(`Cannot open private key: ${(e as Error).message}`);
        }

        /* istanbul ignore next */
        if (!privateKey || privateKey instanceof KJUR.crypto.ECDSA || privateKey instanceof KJUR.crypto.DSA) {
            throw new Error(`Cannot open private key: type not supported only RSAKey is accepted`);
        }

        return callableFunction(privateKey);
    }
}
