import { md, pki } from 'node-forge';
import { Mixin } from 'ts-mixer';
import { KeyTrait } from './internal/key-trait.js';
import { KeyType } from './internal/key-type-enum.js';
import { LocalFileOpenTrait } from './internal/local-file-open-trait.js';

export class PublicKey extends Mixin(KeyTrait, LocalFileOpenTrait) {
    constructor(source: string) {
        const dataObject: Record<string, unknown> =
            PublicKey.callOnPublicKeyWithContents(
                (publicKey): Record<string, unknown> => {
                    const pem = pki.publicKeyToPem(publicKey);
                    const data: Record<string, unknown> = {};
                    data.bits = publicKey.n.bitLength();
                    data.key = pem;
                    data[KeyType.RSA] = publicKey;
                    data.type = KeyType.RSA;

                    return data;
                },
                source
            );
        super(dataObject);
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
     *
     * @param callableFunction - Function to call and inject content
     * @param _publicKeyContents - PublicKey content
     *
     * @throws Error when Cannot open public key
     */
    private static callOnPublicKeyWithContents<T>(
        callableFunction: (pbk: pki.rsa.PublicKey) => T,
        _publicKeyContents: string
    ): T {
        let pubKey: pki.rsa.PublicKey | undefined;
        let latestError = '';

        try {
            const certPem = pki.certificateFromPem(_publicKeyContents);
            pubKey = certPem.publicKey as pki.rsa.PublicKey;
        } catch (error) {
            latestError = `Cannot open public key: ${(error as Error).message}`;
            pubKey = undefined;
        }

        if (!pubKey) {
            try {
                pubKey = pki.publicKeyFromPem(_publicKeyContents);
            } catch (error) {
                latestError = `Cannot open public key: ${
                    (error as Error).message
                }`;
                pubKey = undefined;
            }
        }

        if (!pubKey) {
            throw new Error(latestError);
        }

        return callableFunction(pubKey);
    }

    /**
     * Verify the signature of some data
     *
     * @param data - Input data
     * @param signature - Target signature
     * @param algorithm - Algorithm to be used
     */
    public verify(
        data: string,
        signature: string,
        algorithm: 'md5' | 'sha1' | 'sha256' | 'sha384' | 'sha512' = 'sha256'
    ): boolean {
        return this.callOnPublicKey((publicKey): boolean => {
            try {
                const sig = md[algorithm].create();
                sig.update(data);

                return publicKey.verify(sig.digest().bytes(), signature);
            } catch (error) {
                throw new Error(`Verify error ${(error as Error).message}`);
            }
        });
    }

    /**
     * Run a Callable function with this public key opened
     *
     * @param callableFunction - Function to call and inject content
     */
    public callOnPublicKey<T>(
        callableFunction: (pbk: pki.rsa.PublicKey) => T
    ): T {
        return PublicKey.callOnPublicKeyWithContents(
            callableFunction,
            this.publicKeyContents()
        );
    }
}
