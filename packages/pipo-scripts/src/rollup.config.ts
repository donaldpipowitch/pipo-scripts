import { join } from 'path';
import { removeSync } from 'fs-extra';
// import resolve from 'rollup-plugin-node-resolve';
// import commonjs from 'rollup-plugin-commonjs';
// import sourceMaps from 'rollup-plugin-sourcemaps';
import typescript from 'rollup-plugin-typescript2';
import { getEntry, pkg } from './files';

const { name, main, module: esmMain } = pkg;

if (!name) {
  throw 'No "name" specified in "package.json".';
}
if (!main) {
  throw 'No "main" specified in "package.json".';
}
if (!esmMain) {
  throw 'No "module" specified in "package.json".';
}

const umdOutput = main.endsWith('.js') ? main : join(main, 'index.js');
const esmOutput = esmMain.endsWith('.esm.js')
  ? esmMain
  : join(esmMain, 'index.esm.js');

const input = getEntry();
const plugins: any[] = [];

const config = {
  input,
  output: [
    { file: umdOutput, name, format: 'umd' },
    { file: esmOutput, format: 'es' }
  ],
  // sourcemap: true,
  // Indicate here external modules you don't wanna include in your bundle (i.e.: 'lodash')
  external: [],
  watch: {
    include: 'src/**'
  },
  plugins
};

if (!input.endsWith('.js')) {
  plugins.push(
    typescript({
      tsconfig: './src/tsconfig.json',
      useTsconfigDeclarationDir: true
    })
  );
}

export default config;
