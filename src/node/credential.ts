import CredentialBase from '#src/base/credential';
import Certificate from '#src/node/certificate';
import PrivateKey from '#src/node/private_key';

export default class Credential extends CredentialBase {
  /**
   * Create a Credential object based on local files (Only works with Node Environment)
   *
   * File paths must be local, can have no schema or file:// schema
   * The certificate file content can be X.509 PEM, X.509 DER or X.509 DER base64
   * The private key content can be PKCS#8 DER, PKCS#8 PEM or PKCS#5 PEM
   *
   * @param certificateFile - filename of certificate
   * @param privateKeyFile - filename of private key
   * @param passPhrase - password
   *
   * This function only works in Node.js.
   */
  public static openFiles(
    certificateFile: string,
    privateKeyFile: string,
    passPhrase: string,
  ): Credential {
    const certificate = Certificate.openFile(certificateFile);
    const privateKey = PrivateKey.openFile(privateKeyFile, passPhrase);

    return new Credential(certificate, privateKey);
  }
}
