export default class PemExtractor {
  private readonly contents: string;

  public constructor(context: string) {
    this.contents = context;
  }

  public getContents(): string {
    return this.contents;
  }

  public extractCertificate(): string {
    return this.extractBase64('CERTIFICATE');
  }

  public extractPublicKey(): string {
    return this.extractBase64('PUBLIC KEY');
  }

  public extractPrivateKey(): string {
    // See https://github.com/kjur/jsrsasign/wiki/Tutorial-for-PKCS5-and-PKCS8-PEM-private-key-formats-differences
    // PKCS#8 plain private key
    let extracted = this.extractBase64('PRIVATE KEY');
    if (extracted !== '') {
      return extracted;
    }

    // PKCS#5 plain private key
    extracted = this.extractBase64('RSA PRIVATE KEY');
    if (extracted !== '') {
      return extracted;
    }

    // PKCS#5 encrypted private key
    extracted = this.extractRsaProtected();
    if (extracted !== '') {
      return extracted;
    }

    // PKCS#8 encrypted private key
    return this.extractBase64('ENCRYPTED PRIVATE KEY');
  }

  protected extractBase64(raw: string): string {
    let type = raw;
    type = type.replaceAll(/[!$()*+./:<=>?[\\\]^{|}-]/g, String.raw`\$&`);

    const pattern = `^-----BEGIN ${type}-----\r?\n([A-Za-z0-9+/=]+\r?\n)+-----END ${type}-----\r?\n?$`;
    // eslint-disable-next-line security/detect-non-literal-regexp
    const matches = new RegExp(pattern, 'm').exec(this.getContents());

    return this.normalizeLineEndings(matches ? matches[0] : '');
  }

  protected extractRsaProtected(): string {
    const pattern =
      '^-----BEGIN RSA PRIVATE KEY-----\r?\nProc-Type: .+\r?\nDEK-Info: .+\r?\n\r?\n(?:[A-Za-z0-9+/=]+\r?\n)+-----END RSA PRIVATE KEY-----\r?\n?$';
    const matches = new RegExp(pattern, 'm').exec(this.getContents());

    return this.normalizeLineEndings(matches ? matches[0] : '');
  }

  protected normalizeLineEndings(content: string): string {
    return content.replaceAll('\r\n', '\n');
  }
}
