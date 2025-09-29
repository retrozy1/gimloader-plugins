import fs from 'fs';

const pkg = JSON.parse(fs.readFileSync('./package.json', 'utf-8'));

/** @type {import('@gimloader/build').Config} */
export default {
  input: "./src/index.ts",
  name: "Communication",
  description: "Communication between different clients in 2D gamemodes",
  author: "retrozy",
  version: pkg.version,
  gamemodes: ['2d']
}