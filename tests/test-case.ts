import { existsSync, readFileSync } from 'fs';
import { newline_toUnix } from 'jsrsasign';

export class TestCase {
    public static filePath(filename: string): string {
        return `${__dirname}/_files/${filename}`;
    }

    public static fileContents(filename: string): string {
        if (!existsSync(TestCase.filePath(filename))) {
            return '';
        }
        let binaryString = readFileSync(TestCase.filePath(filename), 'binary');
        binaryString = newline_toUnix(binaryString);

        return binaryString.replace(/\n$/, '');
    }
}
