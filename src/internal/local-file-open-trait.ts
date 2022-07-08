export class LocalFileOpenTrait {
    /**
     * Read file and return file contents as binary string
     *
     * @param filename - file name to be read
     * @returns binary string of file contents
     *
     * This function only works in Node.js.
     */
    public static localFileOpen(filename: string): string {
        /* istanbul ignore next */
        if (typeof window !== 'undefined' && typeof window.document !== undefined) {
            console.warn('Método no disponible en browser');
            throw new Error('Método no disponible en browser');
        }

        if ('file://' == filename.substring(0, 7)) {
            filename = filename.substring(7);
        }

        if ('' == filename) {
            throw new Error('The file to open is empty');
        }

        if (/(ftp|http|https):\/\/(\w+:?\w*@)?(\S+)(:\d+)?(\/|\/([\w#!:.?+=&%@\-/]))?/.test(filename)) {
            throw new Error('Invalid scheme to open file');
        }

        let path = '';
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const fs = require('fs');
        try {
            path = fs.realpathSync(filename);
        } catch (e) {
            throw new Error('Unable to locate the file to open');
        }
        let contents = '';
        try {
            contents = fs.readFileSync(path, 'binary');
        } catch (e) {
            throw new Error('File content is empty');
        }

        return contents;
    }
}
