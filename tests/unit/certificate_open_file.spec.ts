import Certificate from '#src/node/certificate';
import { filePath } from '../test_utils.js';

describe('certificate open file', () => {
  test('open file with pem contents', () => {
    const filename = filePath('FIEL_AAA010101AAA/certificate.cer.pem');
    const certificate = Certificate.openFile(filename);

    expect(certificate.serialNumber().bytes()).toBe('30001000000300023685');
  });

  test('open file with der contents', () => {
    const filename = filePath('FIEL_AAA010101AAA/certificate.cer');
    const certificate = Certificate.openFile(filename);

    expect(certificate.serialNumber().bytes()).toBe('30001000000300023685');
  });
});
