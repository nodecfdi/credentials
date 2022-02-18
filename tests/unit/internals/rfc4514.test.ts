import { Rfc4514 } from '../../../src/internal/rfc4514';

describe('Rfc4514', () => {
    let object: Rfc4514;

    beforeAll(() => {
        object = new Rfc4514();
    });

    test.each([
        ['normal', 'foo bar', 'foo bar'],
        ['with lead space', ' foo', '\\20foo'],
        ['with double lead space', '  foo', '\\20 foo'],
        ['with inner space', 'foo bar', 'foo bar'],
        ['with trail space', 'foo ', 'foo\\20'],
        ['with lead #', '#foo bar', '\\22foo bar'],
        ['with double lead #', '##foo', '\\22#foo'],
        ['with inner #', 'foo#bar', 'foo#bar'],
        ['with trail #', 'foo bar#', 'foo bar#'],
        ['with =', '=foo=bar=', '\\3dfoo\\3dbar\\3d'],
        ['complex : [# a=1,b>2,c<3 ]', '# a=1,b>2,c<3 ', '\\22 a\\3d1\\2cb\\3e2\\2cc\\3c3\\20'],
    ])('escape %s', (name: string, subject: string, expected: string) => {
        expect(object.escape(subject)).toBe(expected);
    });

    test('escape record', () => {
        const subject = {
            foo: 'foo bar',
            '#foo': '#foo bar',
            'foo ': 'foo bar ',
            address: 'Street #1, Somewhere',
        };
        const expected = [
            'foo=foo bar',
            '\\22foo=\\22foo bar',
            'foo\\20=foo bar\\20',
            'address=Street #1\\2c Somewhere',
        ].join(',');
        expect(object.escapeRecord(subject)).toBe(expected);
    });
});
