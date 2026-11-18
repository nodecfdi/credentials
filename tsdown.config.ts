import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    node: 'src/node/index.ts',
    types: 'src/types.ts',
  },
  format: ['esm', 'cjs'],
  platform: 'neutral',
  deps: {
    neverBundle: [/^node:/],
  },
  dts: true,
  clean: true,
});
