import { readFileSync, realpathSync } from 'fs';

export class LocalFileOpenTrait {
    public static localFileOpen(filename: string): string {
        if ('file://' == filename.substring(0, 7)) {
            filename = filename.substring(7);
        }

        if ('' == filename) {
            throw new SyntaxError('The file to open is empty');
        }

        if (/(ftp|http|https):\/\/(\w+:?\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@\-/]))?/.test(filename)) {
            throw new SyntaxError('Invalid scheme to open file');
        }

        let path = '';
        try {
            path = realpathSync(filename);
        } catch (e) {
            throw new Error('Unable to locate the file to open');
        }
        let contents = '';
        try {
            contents = readFileSync(path, 'binary');
        } catch (e) {
            throw new Error('File content is empty');
        }
        return contents;
    }
}
