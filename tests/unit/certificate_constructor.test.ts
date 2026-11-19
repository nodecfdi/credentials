import { describe, expect, test } from 'vitest';
import Certificate from '../../src/certificate';
import { utilities } from '../../test_helpers/test_utilities.js';

describe('certificate constructor', () => {
  test('constructor with pem content', () => {
    const pem = utilities.fileContents('FIEL_AAA010101AAA/certificate.cer.pem');
    const certificate = new Certificate(pem);

    expect(certificate.serialNumber().bytes()).toBe('30001000000300023685');
  });

  test('constructor with der content', () => {
    const contents = utilities.fileContents('FIEL_AAA010101AAA/certificate.cer');
    const certificate = new Certificate(contents);

    expect(certificate.serialNumber().bytes()).toBe('30001000000300023685');
  });

  test('constructor with der base64 content', () => {
    const contents = utilities.fileContents('FIEL_AAA010101AAA/certificate_plain.pem').trim();
    const certificate = new Certificate(contents);

    expect(certificate.serialNumber().bytes()).toBe('30001000000300023685');
  });

  test('constructor with empty content', () => {
    const t = (): Certificate => new Certificate('');

    expect(t).toThrow(Error);
    expect(t).toThrow('Create certificate from empty contents');
  });

  test('constructor with invalid content', () => {
    const t = (): Certificate => new Certificate('x');

    expect(t).toThrow(Error);
    expect(t).toThrow('Cannot parse X509 certificate from contents');
  });
});
