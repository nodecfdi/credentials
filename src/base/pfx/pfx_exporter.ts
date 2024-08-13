import forge from '@vilic/node-forge';
import type Credential from '#src/base/credential';
import { type AlgorithmPfx } from '#src/types';

export default class PfxExporter {
  private readonly _credential: Credential;

  public constructor(credential: Credential) {
    this._credential = credential;
  }

  public getCredential(): Credential {
    return this._credential;
  }

  public export(passPhrase: string, algorithm?: AlgorithmPfx): string {
    const pfx = this.getPfxFromCredential(passPhrase, algorithm);

    return forge.asn1.toDer(pfx).getBytes();
  }

  public exportToBase64(passPhrase: string, algorithm?: AlgorithmPfx): string {
    return forge.util.encode64(this.export(passPhrase, algorithm));
  }

  private getPfxFromCredential(passPhrase: string, algorithm?: AlgorithmPfx): forge.asn1.Asn1 {
    try {
      const privateKey = forge.pki.decryptRsaPrivateKey(
        this._credential.privateKey().pem(),
        this._credential.privateKey().passPhrase(),
      );
      const certificate = forge.pki.certificateFromPem(this._credential.certificate().pem());

      return forge.pkcs12.toPkcs12Asn1(privateKey, [certificate], passPhrase, { algorithm });
    } catch {
      throw new Error(
        `Cannot export credential with certificate ${this._credential.certificate().serialNumber().bytes()}`,
      );
    }
  }
}
