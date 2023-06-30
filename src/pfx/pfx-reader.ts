import { asn1, pkcs12, pki } from 'node-forge';
import { Mixin } from 'ts-mixer';
import { Credential } from '../credential.js';
import { LocalFileOpenTrait } from '../internal/local-file-open-trait.js';

export class PfxReader extends Mixin(LocalFileOpenTrait) {
    public static createCredentialFromContents(contents: string, passPhrase: string): Credential {
        if (contents === '') {
            throw new Error('Cannot create credential from empty PFX contents');
        }

        const pfx = this.loadPkcs12(contents, passPhrase);

        return Credential.create(pki.certificateToPem(pfx.cert), pki.privateKeyToPem(pfx.pKey), '');
    }

    public static createCredentialFromFile(filename: string, passPhrase: string): Credential {
        return this.createCredentialFromContents(this.localFileOpen(filename), passPhrase);
    }

    public static loadPkcs12(contents: string, password = ''): { cert: pki.Certificate; pKey: pki.PrivateKey } {
        try {
            const p12Asn1 = asn1.fromDer(contents);
            const p12 = pkcs12.pkcs12FromAsn1(p12Asn1, password);
            const bagSearchCert = p12.getBags({ bagType: pki.oids.certBag });
            const bagResult = bagSearchCert[pki.oids.certBag]![0];
            const { cert } = bagResult;

            const bagSearchKey = p12.getBags({ bagType: pki.oids.pkcs8ShroudedKeyBag });
            const bagsResult = bagSearchKey[pki.oids.pkcs8ShroudedKeyBag]![0];

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
