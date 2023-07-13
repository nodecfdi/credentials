/* eslint-disable prefer-destructuring */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import forge from 'node-forge';
import { Mixin } from 'ts-mixer';
import { Credential } from '../credential.js';
import { LocalFileOpenTrait } from '../internal/local-file-open-trait.js';

export class PfxReader extends Mixin(LocalFileOpenTrait) {
    public static createCredentialFromContents(contents: string, passPhrase: string): Credential {
        if (contents === '') {
            throw new Error('Cannot create credential from empty PFX contents');
        }

        const pfx = this.loadPkcs12(contents, passPhrase);

        return Credential.create(forge.pki.certificateToPem(pfx.cert), forge.pki.privateKeyToPem(pfx.pKey), '');
    }

    public static createCredentialFromFile(filename: string, passPhrase: string): Credential {
        return this.createCredentialFromContents(this.localFileOpen(filename), passPhrase);
    }

    public static loadPkcs12(
        contents: string,
        password = ''
    ): { cert: forge.pki.Certificate; pKey: forge.pki.PrivateKey } {
        try {
            const p12Asn1 = forge.asn1.fromDer(contents);
            const p12 = forge.pkcs12.pkcs12FromAsn1(p12Asn1, password);
            const bagSearchCert = p12.getBags({ bagType: forge.pki.oids.certBag });
            const bagResult = bagSearchCert[forge.pki.oids.certBag]![0];
            const { cert } = bagResult;

            const bagSearchKey = p12.getBags({
                bagType: forge.pki.oids.pkcs8ShroudedKeyBag,
            });
            const bagsResult = bagSearchKey[forge.pki.oids.pkcs8ShroudedKeyBag]![0];

            const { key } = bagsResult;

            return {
                cert: cert!,
                pKey: key!,
            };
        } catch {
            throw new Error('Invalid PKCS#12 contents or wrong passphrase');
        }
    }
}
