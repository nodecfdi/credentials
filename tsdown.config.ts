import { defineConfig } from 'tsdown';

export default defineConfig([
  {
    entry: {
      index: 'index.ts',
      node: 'src/node/index.ts',
      types: 'src/types.ts',
    },
    clean: true,
    format: 'esm',
    unbundle: true,
    minify: 'dce-only',
    fixedExtension: false,
    dts: true,
    platform: 'neutral',
    deps: {
      neverBundle: [/^node:/],
    },
    target: 'esnext',
    exports: true,
  },
  {
    entry: {
      index: 'index.ts',
    },
    clean: false,
    format: 'iife',
    globalName: 'ncfdiCredentials',
    platform: 'browser',
    unbundle: false,
    deps: {
      alwaysBundle: ['node-forge', '@nodecfdi/base-converter'],
    },
    outputOptions: {
      globals: {
        luxon: 'luxon',
      },
    },
    minify: 'dce-only',
    fixedExtension: false,
    dts: false,
    target: 'esnext',
  },
]);
