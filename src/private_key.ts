import type Certificate from './certificate';
import type { Algorithm } from './types';
import forge from 'node-forge';
import Key from './internal/key';
import { KeyType } from './internal/key_type';
import PemExtractor from './pem_extractor';
import PublicKey from './public_key';

export default class PrivateKey extends Key {
  /**
  String PEM contents of private key
   */
  private readonly _pem: string;

  /**
  String password of private key
   */
  private readonly _passPhrase: string;

  /**
   * Public key extracted from private key
   */
  private _publicKey?: PublicKey;

  /**
   * Parsed RSA private key cached instance
   */
  private _parsedPrivateKey?: forge.pki.rsa.PrivateKey;

  /**
   * Private key constructor
   *
   * @param source - can be a PKCS#8 DER, PKCS#8 PEM or PKCS#5 PEM
   * @param passPhrase - if empty asume unencrypted/plain private key
   */
  public constructor(source: string, passPhrase: string) {
    super({});
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

  public pem(): string {
    return this._pem;
  }

  public passPhrase(): string {
    return this._passPhrase;
  }

  public publicKey(): PublicKey {
    this._publicKey ??= new PublicKey(this.publicKeyContents());

    return this._publicKey;
  }

  /**
   * Sign string data by provider algorithm
   *
   * @param data - input data
   * @param algorithm - algorithm to be used
   * @returns binary string signature
   */
  public sign(data: string, algorithm: Algorithm = 'sha256'): string {
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
    const pubKey = forge.pki.publicKeyFromPem(this.publicKeyContents());
    const x = forge.pki.certificateFromPem(certificate);
    const certPubKey = x.publicKey as forge.pki.rsa.PublicKey;

    return certPubKey.n.compareTo(pubKey.n) === 0 && certPubKey.e.compareTo(pubKey.e) === 0;
  }

  public callOnPrivateKey<T>(callableFunction: (prv: forge.pki.rsa.PrivateKey) => T): T {
    if (!this._parsedPrivateKey) {
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

      this._parsedPrivateKey = privateKey;
    }

    return callableFunction(this._parsedPrivateKey);
  }

  public changePassPhrase(newPassPhrase: string): PrivateKey {
    const pem = this.callOnPrivateKey((privateKey) => {
      const rsaPrivateKey = forge.pki.privateKeyToAsn1(privateKey);
      const privateKeyInfo = forge.pki.wrapRsaPrivateKey(rsaPrivateKey);

      if (newPassPhrase === '') {
        return forge.pki.privateKeyInfoToPem(privateKeyInfo);
      }

      const encryptPrivateKeyInfo = forge.pki.encryptPrivateKeyInfo(privateKeyInfo, newPassPhrase);

      return forge.pki.encryptedPrivateKeyToPem(encryptPrivateKeyInfo);
    });

    return new PrivateKey(pem, newPassPhrase);
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
      `${forge.util
        .encode64(contents)
        .match(/.{1,64}/g)!
        .join('\n')}\n`,
      `-----END ${privateKeyName}-----`,
    ].join('');
  }
}
