import { join } from 'path';
import { existsSync } from 'fs';

export const cwd = process.cwd();
const joinCwd = (file: string) => join(cwd, file);
export const pkg = require(joinCwd('package.json'));

function findFile(files: string[]) {
  for (const file of files) {
    if (existsSync(file)) {
      return file;
    }
  }
}

export function getEntry() {
  const files = ['./src/index.tsx', './src/index.ts', './src/index.js'];
  const file = findFile(files);
  if (file) {
    return file;
  } else {
    throw `Couldn't find entry file.`;
  }
}

export function getBabelConfig() {
  const files = ['src/.babelrc', 'src/.babelrc.js', '.babelrc', '.babelrc.js'];
  const file = findFile(files);
  const config = file ? joinCwd(file) : './babelrc';
  return require(config);
}
