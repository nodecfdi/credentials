import type { ParseArgsOptionsConfig } from 'node:util';

export interface CliIO {
  stdout: (text: string) => void;
  stderr: (text: string) => void;
  readStdin: () => Promise<Uint8Array> | Uint8Array;
  env: Record<string, string | undefined>;
}

export type SignatureEncoding = 'base64' | 'hex' | 'binary';

export interface CertificateData {
  rfc: string;
  legalName: string;
  serialNumber: string;
  serialNumberHex: string;
  serialNumberDecimal: string;
  type: 'FIEL' | 'CSD';
  branchName: string;
  validFrom: string;
  validTo: string;
  valid: boolean;
  issuer: string;
  version: string;
  pem: string;
  pemOneLine: string;
}

export type ParsedValues<T extends ParseArgsOptionsConfig> = {
  -readonly [K in keyof T]?: T[K]['type'] extends 'boolean' ? boolean : string;
};

export interface SecretSource {
  value?: string;
  file?: string;
}

export interface SecretNames {
  option: string;
  fileOption: string;
  envKey?: string;
}

export interface SourceValues {
  'cer'?: string;
  'key'?: string;
  'pfx'?: string;
  'password'?: string;
  'password-file'?: string;
}

export interface DataInputValues {
  data?: string;
  file?: string;
}

export type CommandHandler = (argv: string[], io: CliIO) => Promise<number> | number;
