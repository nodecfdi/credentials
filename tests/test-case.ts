import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

export const useTestCase = () => {
    const filePath = (filename: string): string => {
        return join(dirname(fileURLToPath(import.meta.url)), '_files', filename);
    };

    const fileContents = (filename: string): string => {
        if (!existsSync(filePath(filename))) {
            return '';
        }

        return readFileSync(filePath(filename), 'binary');
    };

    return {
        filePath,
        fileContents,
    };
};
