import { writeFileSync } from 'node:fs';
import { Mixin } from 'ts-mixer';
import PfxExporterBase from '#src/base/pfx/pfx_exporter';
import LocalFileOpen from '#src/internal/local_file_open';
import { type AlgorithmPfx } from '#src/types';

export default class PfxExporter extends Mixin(PfxExporterBase, LocalFileOpen) {
  public exportToFile(pfxFile: string, passPhrase: string, algorithm?: AlgorithmPfx): void {
    const data = new Uint8Array(Buffer.from(this.export(passPhrase, algorithm), 'binary'));
    writeFileSync(pfxFile, data);
  }
}
