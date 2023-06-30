import { Derive } from '@ddd-ts/traits';
import { asn1, pkcs12, pki, util } from 'node-forge';
import { type Credential } from '../credential.js';
import { LocalFileOpenTrait } from '../internal/local-file-open-trait.js';

export type AlgorithmPfx = 'aes128' | 'aes192' | 'aes256' | '3des';

export class PfxExporter extends Derive(LocalFileOpenTrait) {
    private readonly _credential: Credential;

    constructor(credential: Credential) {
        super({});
        this._credential = credential;
    }

    public getCredential(): Credential {
        return this._credential;
    }

    public export(passPhrase: string, algorithm?: AlgorithmPfx): string {
        const pfx = this.getPfxFromCredential(passPhrase, algorithm);
        return asn1.toDer(pfx).getBytes();
    }

    public exportToBase64(passPhrase: string, algorithm?: AlgorithmPfx): string {
        return util.encode64(this.export(passPhrase, algorithm));
    }

    private getPfxFromCredential(passPhrase: string, algorithm?: AlgorithmPfx): asn1.Asn1 {
        try {
            const privateKey = pki.decryptRsaPrivateKey(
                this._credential.privateKey().pem(),
                this._credential.privateKey().passPhrase()
            );
            const certificate = pki.certificateFromPem(this._credential.certificate().pem());

            return pkcs12.toPkcs12Asn1(privateKey, [certificate], passPhrase, { algorithm });
        } catch {
            throw new Error(
                `Cannot export credential with certificate ${this._credential.certificate().serialNumber().bytes()}`
            );
        }
    }
}
