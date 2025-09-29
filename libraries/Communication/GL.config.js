import fs from 'fs';

const pkg = JSON.parse(fs.readFileSync('./package.json', 'utf-8'));

/** @type {import('@gimloader/build').Config} */
export default {
  input: './src/index.ts',
  name: 'Communication',
  description: pkg.description,
  author: pkg.author,
  version: pkg.version,
  gamemodes: ['2d']
}