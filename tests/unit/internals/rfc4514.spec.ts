import Rfc4514 from '#src/internal/rfc4514';

describe('rfc4514', () => {
  let object: Rfc4514;

  beforeAll(() => {
    object = new Rfc4514();
  });

  test.each([
    ['normal', 'foo bar', 'foo bar'],
    ['with lead space', ' foo', String.raw`\20foo`],
    ['with double lead space', '  foo', String.raw`\20 foo`],
    ['with inner space', 'foo bar', 'foo bar'],
    ['with trail space', 'foo ', String.raw`foo\20`],
    ['with lead #', '#foo bar', String.raw`\22foo bar`],
    ['with double lead #', '##foo', String.raw`\22#foo`],
    ['with inner #', 'foo#bar', 'foo#bar'],
    ['with trail #', 'foo bar#', 'foo bar#'],
    ['with =', '=foo=bar=', String.raw`\3dfoo\3dbar\3d`],
    ['complex : [# a=1,b>2,c<3 ]', '# a=1,b>2,c<3 ', String.raw`\22 a\3d1\2cb\3e2\2cc\3c3\20`],
  ])('escape %s', (_name: string, subject: string, expected: string) => {
    expect(object.escape(subject)).toBe(expected);
  });

  test('escape record', () => {
    const subject = {
      'foo': 'foo bar',
      '#foo': '#foo bar',
      'foo ': 'foo bar ',
      'address': 'Street #1, Somewhere',
    };
    const expected = [
      'foo=foo bar',
      String.raw`\22foo=\22foo bar`,
      String.raw`foo\20=foo bar\20`,
      String.raw`address=Street #1\2c Somewhere`,
    ].join(',');
    expect(object.escapeRecord(subject)).toBe(expected);
  });
});
