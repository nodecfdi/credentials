import { writeFile } from 'node:fs/promises';
import forge from 'node-forge';
import { Mixin } from 'ts-mixer';
import PfxExporterBase from '#src/base/pfx/pfx_exporter';
import LocalFileOpen from '#src/internal/local_file_open';
import { type AlgorithmPfx } from '#src/types';

export default class PfxExporter extends Mixin(PfxExporterBase, LocalFileOpen) {
  public async exportToFile(
    pfxFile: string,
    passPhrase: string,
    algorithm?: AlgorithmPfx,
  ): Promise<void> {
    const forgeBuffer = forge.util.createBuffer();
    forgeBuffer.putBytes(this.export(passPhrase, algorithm));
    const nodeBuffer = Buffer.from(forgeBuffer.getBytes(), 'binary');

    await writeFile(pfxFile, nodeBuffer);
  }
}
