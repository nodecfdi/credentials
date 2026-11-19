import type { Algorithm, AlgorithmPfx } from '../types';
import type { SignatureEncoding } from './types';

export const ALGORITHMS = ['sha256', 'sha1', 'sha384', 'sha512', 'md5'] as const satisfies readonly Algorithm[];
export const PFX_ALGORITHMS = ['aes128', 'aes192', 'aes256', '3des'] as const satisfies readonly AlgorithmPfx[];
export const ENCODINGS = ['base64', 'hex', 'binary'] as const satisfies readonly SignatureEncoding[];

export const MAX_INPUT_BYTES = 10 * 1024 * 1024;
export const MAX_PASSWORD_FILE_BYTES = 4096;
export const PASSWORD_ENV_KEY = 'NODECFDI_PASSWORD';

export const EXIT_ERROR = 1;
export const EXIT_USAGE = 2;
