import { KEYUTIL, KJUR, RSAKey, BigInteger } from 'jsrsasign';
import { Mixin } from 'ts-mixer';

import { Key } from './internal/key';
import { LocalFileOpenTrait } from './internal/local-file-open-trait';
import { KeyType } from './internal/key-type-enum';
import { SignatureAlgorithm } from './signature-algorithm';

export class PublicKey extends Mixin(LocalFileOpenTrait, Key) {
    constructor(source: string) {
        const dataObj: Record<string, unknown> = PublicKey.callOnPublicKeyWithContents(
            (publicKey): Record<string, unknown> => {
                const pem = KEYUTIL.getPEM(publicKey);
                const data: Record<string, unknown> = {};
                data['bits'] = (publicKey as unknown as { n: BigInteger }).n.bitLength();
                data['key'] = pem;
                data[KeyType.RSA] = publicKey;
                data['type'] = KeyType.RSA;

                return data;
            },
            source
        );
        super(dataObj);
    }

    /**
     * Read file and return PublicKey instance
     *
     * @param filename - file name to be read
     * @returns PublicKey instance
     *
     * This function only works in Node.js.
     */
    public static openFile(filename: string): PublicKey {
        return new PublicKey(PublicKey.localFileOpen(filename));
    }

    /**
     * Verify the signature of some data
     *
     * @param data - Input data
     * @param signature - Target signature
     * @param algorithm - Algorithm to be used
     */
    public verify(data: string, signature: string, algorithm: SignatureAlgorithm = SignatureAlgorithm.SHA256): boolean {
        return this.callOnPublicKey((publicKey): boolean => {
            try {
                const sig = new KJUR.crypto.Signature({ alg: algorithm });
                sig.init(publicKey);
                sig.updateString(data);

                return sig.verify(signature);
            } catch (e) {
                throw new Error(`Verify error ${(e as Error).message}`);
            }
        });
    }

    /**
     * Run a Callable function with this public key opened
     *
     * @param callableFunction - Function to call and inject content
     */
    public callOnPublicKey<T>(callableFunction: (pbk: RSAKey) => T): T {
        return PublicKey.callOnPublicKeyWithContents(callableFunction, this.publicKeyContents());
    }

    /**
     *
     * @param callableFunction - Function to call and inject content
     * @param _publicKeyContents - PublicKey content
     *
     * @throws {@link Error} when Cannot open public key
     */
    private static callOnPublicKeyWithContents<T>(callableFunction: (pbk: RSAKey) => T, _publicKeyContents: string): T {
        let pubKey: RSAKey | KJUR.crypto.DSA | KJUR.crypto.ECDSA | undefined = undefined;
        try {
            pubKey = KEYUTIL.getKey(_publicKeyContents);
        } catch (e) {
            throw new Error(`Cannot open public key: ${(e as Error).message}`);
        }

        /* istanbul ignore next */
        if (!pubKey || pubKey instanceof KJUR.crypto.ECDSA || pubKey instanceof KJUR.crypto.DSA) {
            throw new Error(`Cannot open public key: Typo ECDSA no soportado`);
        }

        return callableFunction(pubKey);
    }
}
