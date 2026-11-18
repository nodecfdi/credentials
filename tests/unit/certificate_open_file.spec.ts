import { describe, expect, test } from 'vitest';
import { openCertificateFile } from '../../src/node';
import { utilities } from '../test_utilities.js';

describe('certificate open file', () => {
  test('open file with pem contents', () => {
    const filename = utilities.filePath('FIEL_AAA010101AAA/certificate.cer.pem');
    const certificate = openCertificateFile(filename);

    expect(certificate.serialNumber().bytes()).toBe('30001000000300023685');
  });

  test('open file with der contents', () => {
    const filename = utilities.filePath('FIEL_AAA010101AAA/certificate.cer');
    const certificate = openCertificateFile(filename);

    expect(certificate.serialNumber().bytes()).toBe('30001000000300023685');
  });
});
