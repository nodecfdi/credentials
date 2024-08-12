import forge from 'node-forge';
import Key from '#src/internal/key';
import { KeyType } from '#src/internal/key_type';

export default class PublicKey extends Key {
  public constructor(source: string) {
    const dataObject: Record<string, unknown> = PublicKey.callOnPublicKeyWithContents(
      (publicKey): Record<string, unknown> => {
        const pem = forge.pki.publicKeyToPem(publicKey);
        const data: Record<string, unknown> = {};
        data.bits = publicKey.n.bitLength();
        data.key = pem;
        data[KeyType.RSA] = publicKey;
        data.type = KeyType.RSA;

        return data;
      },
      source,
    );
    super(dataObject);
  }

  /**
   *
   * @param callableFunction - Function to call and inject content
   * @param _publicKeyContents - PublicKey content
   *
   * @throws Error when Cannot open public key
   */
  private static callOnPublicKeyWithContents<T>(
    callableFunction: (pbk: forge.pki.rsa.PublicKey) => T,
    _publicKeyContents: string,
  ): T {
    let pubKey: forge.pki.rsa.PublicKey | undefined;
    let latestError = '';

    try {
      const certPem = forge.pki.certificateFromPem(_publicKeyContents);
      pubKey = certPem.publicKey as forge.pki.rsa.PublicKey;
    } catch (error) {
      latestError = `Cannot open public key: ${(error as Error).message}`;
      pubKey = undefined;
    }

    if (!pubKey) {
      try {
        pubKey = forge.pki.publicKeyFromPem(_publicKeyContents);
      } catch (error) {
        latestError = `Cannot open public key: ${(error as Error).message}`;
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
    algorithm: 'md5' | 'sha1' | 'sha256' | 'sha384' | 'sha512' = 'sha256',
  ): boolean {
    return this.callOnPublicKey((publicKey): boolean => {
      try {
        const sig = forge.md[algorithm].create();
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
  public callOnPublicKey<T>(callableFunction: (pbk: forge.pki.rsa.PublicKey) => T): T {
    return PublicKey.callOnPublicKeyWithContents(callableFunction, this.publicKeyContents());
  }
}
