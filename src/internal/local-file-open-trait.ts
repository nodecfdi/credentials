export abstract class LocalFileOpenTrait {
    /**
     * Read file and return file contents as binary string
     *
     * @param filename - file name to be read
     * @returns binary string of file contents
     *
     * This function only works in Node.js.
     */
    public static localFileOpen(filename: string): string {
        if (typeof window !== 'undefined') {
            throw new TypeError('Método no disponible en browser');
        }

        if (filename.startsWith('file://')) {
            filename = filename.slice(7);
        }

        if (filename === '') {
            throw new Error('The file to open is empty');
        }

        if (
            /(ftp|http|https):\/\/(\w+:?\w*@)?(\S+)(:\d+)?(\/|\/([\w!#%&+./:=?@-]))?/.test(
                filename
            )
        ) {
            throw new Error('Invalid scheme to open file');
        }

        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const fs: {
            realpathSync: (filename: string) => string;
            readFileSync: (path: string, type: string) => string;
            // eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires, unicorn/prefer-module
        } = require('node:fs');

        let path = '';
        try {
            path = fs.realpathSync(filename);
        } catch {
            throw new Error('Unable to locate the file to open');
        }

        let contents = '';
        try {
            contents = fs.readFileSync(path, 'binary');
        } catch {
            throw new Error('File content is empty');
        }

        return contents;
    }
}
