import { Buffer } from 'node:buffer';
import type forge from '@vilic/node-forge';
import { DateTime } from 'luxon';
import Certificate from '#src/base/certificate';
import type SerialNumber from '#src/serial_number';
import { fileContents } from '../test_utils.js';

describe('certificate', () => {
  const createCertificate = (): Certificate =>
    new Certificate(fileContents('FIEL_AAA010101AAA/certificate.cer'));

  const createCertificateSello = (): Certificate =>
    new Certificate(fileContents('CSD01_AAA010101AAA/certificate.cer'));

  test('pem contents only', () => {
    const certificate = createCertificateSello();
    const expected = fileContents('CSD01_AAA010101AAA/certificate.cer.pem').trim();

    expect(certificate.pem().trim()).toStrictEqual(expected);
  });

  test('pem contents as oneline', () => {
    const certificate = createCertificateSello();
    const expected = Buffer.from(
      fileContents('CSD01_AAA010101AAA/certificate.cer'),
      'binary',
    ).toString('base64');

    expect(certificate.pemAsOneLine().trim()).toStrictEqual(expected);
  });

  test('serial number', () => {
    const certificate = createCertificate();
    const serial = certificate.serialNumber();

    expect(serial.bytes()).toBe('30001000000300023685');
    expect(certificate.serialNumber()).toBe(serial);
  });

  test('valid dates', () => {
    const validSince = DateTime.fromISO('2017-05-16T23:29:17Z');
    const validUntil = DateTime.fromISO('2021-05-15T23:29:17Z');
    const certificate = createCertificate();

    expect(certificate.validFromDateTime()).toStrictEqual(validSince);
    expect(certificate.validToDateTime()).toStrictEqual(validUntil);
    expect(certificate.validOn(validSince.minus({ second: 1 }))).toBeFalsy();
    expect(certificate.validOn(validSince)).toBeTruthy();
    expect(certificate.validOn(validUntil)).toBeTruthy();
    expect(certificate.validOn(validUntil.plus({ second: 1 }))).toBeFalsy();
  });

  test('valid on without date', () => {
    const certificate = createCertificate();
    const now = DateTime.now();
    const expected = now.toMillis() <= certificate.validToDateTime().toMillis();

    expect(certificate.validOn()).toBe(expected);
  });

  test('rfc only', () => {
    expect(createCertificate().rfc()).toBe('AAA010101AAA');
  });

  test('legal name', () => {
    expect(createCertificate().legalName()).toBe('ACCEM SERVICIOS EMPRESARIALES SC');
  });

  test('sat type efirma', () => {
    expect(createCertificate().satType().isFiel()).toBeTruthy();
  });

  test('sat_type_sello', () => {
    expect(createCertificateSello().satType().isCsd()).toBeTruthy();
  });

  test('issuer data', () => {
    const certificate = createCertificate();
    expect(certificate.issuerData({ type: '2.5.4.45' }).value).toBe('SAT970701NN3');
  });

  test('issuer as rfc 4514', () => {
    const certificate = createCertificate();
    const expected = [
      'CN=A.C. 2 de pruebas(4096)',
      'O=Servicio de Administración Tributaria',
      'OU=Administración de Seguridad de la Información',
      'E=asisnet@pruebas.sat.gob.mx',
      String.raw`2.5.4.9=Av. Hidalgo 77\2c Col. Guerrero`, // See how it was encoded
      '2.5.4.17=06300',
      'C=MX',
      'ST=Distrito Federal',
      'L=Coyoacán',
      '2.5.4.45=SAT970701NN3',
      '1.2.840.113549.1.9.2=Responsable: ACDMA',
    ];

    expect(certificate.issuerAsRfc4514().split(',')).toStrictEqual(expected);
  });

  test('public key', () => {
    const certificate = createCertificate();
    const first = certificate.publicKey();

    expect(certificate.publicKey()).toBe(first);
  });

  test('parsed', () => {
    const certificate = createCertificate();
    const parsed = certificate.parsed();

    expect(parsed).toHaveProperty('subject');
    expect(certificate.name()).toContain(
      (
        (parsed.subject as forge.pki.Certificate['subject']).getField({
          shortName: 'CN',
        }) as Record<string, unknown>
      ).value,
    );
  });

  test('name', () => {
    const certificate = createCertificate();

    expect(certificate.name().startsWith('/CN=')).toBeTruthy();
  });

  test('hash', () => {
    const certificate = createCertificate();

    expect(certificate.hash()).toBe('d2f2c823204e31bdbbd3acfe5eb133ca912fe16c');
  });

  test('version', () => {
    const certificate = createCertificate();

    expect(certificate.version()).toBe('2');
  });

  test('valid from to', () => {
    const certificate = createCertificate();

    expect(certificate.validFrom()).toBeInstanceOf(Date);
    expect(certificate.validTo()).toBeInstanceOf(Date);
  });

  test('extensions is not empty', () => {
    const certificate = createCertificate();

    expect(certificate.extensions()).not.toBe({});
  });

  test('signature', () => {
    const certificate = createCertificate();

    expect(certificate.signatureTypeLN()).not.toBe('');
  });

  test('certificate with teletexstring', () => {
    const certificate = new Certificate(fileContents('00001000000413053762.cer'));

    expect(certificate.rfc()).toBe('SMA0112284B2');
    expect(certificate.legalName()).toBe('COMPAÑIA SANTA MARIA SA DE CV');
    expect(certificate.branchName()).toBe('COMPAÑIA SANTA MARIA SA DE CV');
  });

  test('create serial number', () => {
    const certificateCreateSerialNumber = (hexadecimal: string, decimal: string): SerialNumber => {
      const certificate = Object.create(Certificate.prototype) as Certificate & {
        createSerialNumber(hexadecimal: string, decimal: string): SerialNumber;
      };
      const sNumber = certificate.createSerialNumber(hexadecimal, decimal);

      return sNumber;
    };

    let serialNumber = certificateCreateSerialNumber('0x3330', '');
    expect(serialNumber.hexadecimal()).toBe('3330');

    serialNumber = certificateCreateSerialNumber('', '0x3330');
    expect(serialNumber.hexadecimal()).toBe('3330');

    serialNumber = certificateCreateSerialNumber('', '13104');
    expect(serialNumber.hexadecimal()).toBe('3330');

    const t = (): SerialNumber => certificateCreateSerialNumber('', '');

    expect(t).toThrow(Error);
    expect(t).toThrow('Certificate does not contain a serial number');
  });
});
