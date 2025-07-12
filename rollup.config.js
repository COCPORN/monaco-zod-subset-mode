import typescript from '@rollup/plugin-typescript';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

export default {
  input: 'src/index.ts',
  output: [
    {
      file: 'dist/index.cjs.js',
      format: 'cjs',
    },
    {
      file: 'dist/index.esm.js',
      format: 'esm',
    },
    {
      file: 'dist/bundle.js',
      format: 'iife',
      name: 'monacoZodSubset',
      globals: {
        'monaco-editor': 'monaco'
      }
    }
  ],
  external: ['monaco-editor'],
  plugins: [
    typescript(),
    nodeResolve(),
    commonjs()
  ]
};
