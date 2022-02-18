import { Key } from './internal/key';
import { delegate } from 'typescript-mix';
import { LocalFileOpenTrait } from './internal/local-file-open-trait';
import { KEYUTIL, KJUR, RSAKey, BigInteger } from 'jsrsasign';
import { SignatureAlgorithm } from './signature-algorithm';
import { KeyType } from './internal/key-type-enum';

export class PublicKey extends Key {
    @delegate(LocalFileOpenTrait.localFileOpen)
    private static localFileOpen: (filename: string) => string;

    constructor(source: string) {
        const dataObj: Record<string, string> = PublicKey.callOnPublicKeyWithContents(
            (publicKey: RSAKey | KJUR.crypto.DSA | KJUR.crypto.ECDSA): Record<string, unknown> => {
                const pem = KEYUTIL.getPEM(publicKey);
                const data: Record<string, unknown> = {};
                if (publicKey instanceof RSAKey) {
                    data['bits'] = (publicKey as unknown as { n: BigInteger }).n.bitLength();
                    data['key'] = pem;
                    data[KeyType.RSA] = publicKey;
                    data['type'] = KeyType.RSA;
                } else if (publicKey instanceof KJUR.crypto.DSA) {
                    data['bits'] = (publicKey as unknown as { p: BigInteger }).p.bitLength();
                    data['key'] = pem;
                    data[KeyType.DSA] = publicKey;
                    data['type'] = KeyType.DSA;
                } else {
                    throw new Error('Cannot open public key');
                }
                return data;
            },
            source
        );
        super(dataObj);
    }

    public static openFile(filename: string): PublicKey {
        return new PublicKey(PublicKey.localFileOpen(filename));
    }

    /**
     * Verify the signature of some data
     *
     * @param data
     * @param signature
     * @param algorithm
     */
    public verify(data: string, signature: string, algorithm = SignatureAlgorithm.SHA256withRSA): boolean {
        return this.callOnPublicKey((publicKey: RSAKey | KJUR.crypto.DSA | KJUR.crypto.ECDSA): boolean => {
            return this.signVerify(data, signature, publicKey, algorithm);
        });
    }

    /**
     * This method is created to replace openssl_verify
     *
     * @param data
     * @param signature
     * @param publicKey
     * @param algorithm
     * @protected
     */
    protected signVerify(
        data: string,
        signature: string,
        publicKey: RSAKey | KJUR.crypto.DSA | KJUR.crypto.ECDSA,
        algorithm = SignatureAlgorithm.SHA256withRSA
    ): boolean {
        const validator = new KJUR.crypto.Signature({ alg: algorithm });
        validator.init(publicKey);
        validator.updateString(data);
        return validator.verify(signature);
    }

    /**
     * Run a Callable function with this public key opened
     *
     * @param callableFunction
     */
    public callOnPublicKey<T>(callableFunction: CallableFunction): T {
        return PublicKey.callOnPublicKeyWithContents(callableFunction, this.publicKeyContents());
    }

    /**
     *
     * @param callableFunction
     * @param _publicKeyContents
     * @private
     * @throws {Error} when Cannot open public key
     */
    private static callOnPublicKeyWithContents<T>(callableFunction: CallableFunction, _publicKeyContents: string): T {
        let pubKey: RSAKey | KJUR.crypto.DSA | KJUR.crypto.ECDSA | null = null;
        try {
            pubKey = KEYUTIL.getKey(_publicKeyContents);
        } catch (e) {
            if (e instanceof Error) throw new Error(`Cannot open public key: ${e.message}`);
        }
        return callableFunction(pubKey);
    }
}
