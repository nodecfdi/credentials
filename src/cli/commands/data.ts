import type Certificate from '../../certificate';
import type { CertificateData, CliIO } from '../types';
import { CliUsageError } from '../errors';
import { DATA_HELP } from '../help';
import { loadCertificate } from '../loaders';
import { HELP_OPTIONS, parseCommandArgs, PASSWORD_OPTIONS } from '../options';

const OPTIONS = {
  cer: { type: 'string', short: 'c' },
  pfx: { type: 'string' },
  ...PASSWORD_OPTIONS,
  field: { type: 'string', short: 'f' },
  json: { type: 'boolean' },
  ...HELP_OPTIONS,
} as const;

const FIELDS = [
  ['rfc', 'rfc'],
  ['legal-name', 'legalName'],
  ['serial-number', 'serialNumber'],
  ['serial-number-hex', 'serialNumberHex'],
  ['serial-number-decimal', 'serialNumberDecimal'],
  ['type', 'type'],
  ['branch-name', 'branchName'],
  ['valid-from', 'validFrom'],
  ['valid-to', 'validTo'],
  ['valid', 'valid'],
  ['issuer', 'issuer'],
  ['version', 'version'],
  ['pem', 'pem'],
  ['pem-one-line', 'pemOneLine'],
] as const satisfies readonly (readonly [string, keyof CertificateData])[];

function resolveField(value: string): keyof CertificateData {
  const match = FIELDS.find(([kebab, camel]) => value === kebab || value === camel);
  if (!match) {
    throw new CliUsageError(
      `Valor no esperado para --field: "${value}". Valores permitidos: ${FIELDS.map(([kebab]) => kebab).join(', ')}.`,
    );
  }

  return match[1];
}

function extractCertificateData(certificate: Certificate): CertificateData {
  const serial = certificate.serialNumber();

  return {
    rfc: certificate.rfc(),
    legalName: certificate.legalName(),
    serialNumber: serial.bytes(),
    serialNumberHex: serial.hexadecimal(),
    serialNumberDecimal: serial.decimal(),
    type: certificate.satType().isFiel() ? 'FIEL' : 'CSD',
    branchName: certificate.branchName(),
    validFrom: certificate.validFrom().toISOString(),
    validTo: certificate.validTo().toISOString(),
    valid: certificate.validOn(),
    issuer: certificate.issuerAsRfc4514(),
    version: certificate.version(),
    pem: certificate.pem(),
    pemOneLine: certificate.pemAsOneLine(),
  };
}

function formatHumanReadable(data: CertificateData): string {
  const lines = [
    `RFC:              ${data.rfc}`,
    `Razón social:     ${data.legalName}`,
    `Número de serie:  ${data.serialNumber} (hex: ${data.serialNumberHex})`,
    `Tipo:             ${data.type}`,
    `Sucursal (OU):    ${data.branchName || '(ninguna)'}`,
    `Válido desde:     ${data.validFrom}`,
    `Válido hasta:     ${data.validTo}`,
    `Vigente ahora:    ${data.valid ? 'Sí' : 'No'}`,
    `Emisor:           ${data.issuer}`,
    `Versión:          ${data.version}`,
  ];

  return `${lines.join('\n')}\n`;
}

export function runDataCommand(argv: string[], io: CliIO): number {
  const values = parseCommandArgs(argv, OPTIONS);

  if (values.help) {
    io.stdout(DATA_HELP);

    return 0;
  }

  const field = values.field === undefined ? undefined : resolveField(values.field);
  const data = extractCertificateData(loadCertificate(values, io));

  if (field === undefined) {
    io.stdout(values.json ? `${JSON.stringify(data, null, 2)}\n` : formatHumanReadable(data));
  } else {
    io.stdout(values.json ? `${JSON.stringify({ [field]: data[field] })}\n` : `${String(data[field])}\n`);
  }

  return 0;
}
