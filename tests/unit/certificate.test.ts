import { TestCase } from '../test-case';
import { Certificate } from "../../src";
import { DateTime } from 'luxon';

describe('Certificate', () => {
    const createCertificate = (): Certificate => {
        return new Certificate(TestCase.fileContents('FIEL_AAA010101AAA/certificate.cer'));
    };

    const createCertificateSello = (): Certificate => {
        return new Certificate(TestCase.fileContents('CSD01_AAA010101AAA/certificate.cer'));
    };

    test('pem contents', () => {
        const certificate = createCertificateSello();
        const expected = TestCase.fileContents('CSD01_AAA010101AAA/certificate.cer.pem').trim();

        expect(certificate.pem().trim()).toBe(expected);
    });

    test('pem contents as one line', () => {
        const certificate = createCertificateSello();
        const expected = Buffer.from(TestCase.fileContents('CSD01_AAA010101AAA/certificate.cer'), 'binary').toString(
            'base64'
        );

        expect(certificate.pemAsOneLine().trim()).toBe(expected);
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

    test('rfc', () => {
        expect(createCertificate().rfc()).toBe('AAA010101AAA');
    });

    test('legal name', () => {
        expect(createCertificate().legalName()).toBe('ACCEM SERVICIOS EMPRESARIALES SC');
    });

    test('sat type sello', () => {
        expect(createCertificateSello().satType().isCsd()).toBeTruthy();
    });

    test('issuer data', () => {
        const certificate = createCertificate();
        expect(certificate.issuerData('uniqueIdentifier')).toBe('SAT970701NN3');
    });

    test('issuer as rfc 4514', () => {
        const certificate = createCertificate();
        const expected = [
            'CN=A.C. 2 de pruebas(4096)',
            'O=Servicio de Administración Tributaria',
            'OU=Administración de Seguridad de la Información',
            'E=asisnet@pruebas.sat.gob.mx',
            'STREET=Av. Hidalgo 77\\2c Col. Guerrero', // see how it was encoded
            'postalCode=06300',
            'C=MX',
            'ST=Distrito Federal',
            'L=Coyoacán',
            'uniqueIdentifier=SAT970701NN3',
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
        expect(certificate.name()).toBe((parsed.subject as { str: string }).str);
    });

    test('name', () => {
        const certificate = createCertificate();

        expect(certificate.name().startsWith('/CN=')).toBeTruthy();
    });

    test('hash', () => {
        const certificate = createCertificate();

        expect(certificate.hash()).toBe('3d2d560e90dcc3f75c46f30c2850cf9fb0640ccb');
    });

    test('version', () => {
        const certificate = createCertificate();

        expect(certificate.version()).toBe('3');
    });

    test('valid from to', () => {
        const certificate = createCertificate();

        expect(certificate.validFrom()).toMatch(/\d+z/gi);
        expect(certificate.validTo()).toMatch(/\d+z/gi);
    });

    test('extensions is not empty', () => {
        const certificate = createCertificate();

        expect(certificate.extensions()).not.toBe({});
    });

    test('signature', () => {
        const certificate = createCertificate();

        expect(certificate.signatureTypeLN()).not.toBe('');
    });
});
