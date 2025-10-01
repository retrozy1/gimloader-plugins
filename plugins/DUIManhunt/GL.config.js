import fs from 'fs';

const pkg = JSON.parse(fs.readFileSync('./package.json', 'utf-8'));

/** @type {import('@gimloader/build').Config} */
export default {
  input: './src/index.ts',
  name: 'DUIManhunt',
  description: pkg.description,
  author: pkg.author,
  version: pkg.version,
  gamemodes: ['mining'],
  libs: ['Communication | https://raw.githubusercontent.com/retrozy1/gimloader-plugins/refs/heads/main/libraries/Communication/src/build/build.js']
}