import fs from 'fs';

const pkg = JSON.parse(fs.readFileSync('./package.json', 'utf-8'));

/** @type {import('@gimloader/build').Config} */
export default {
    input: "./src/index.ts",
    name: "DUIManhunt",
    description: "Manhunt for Dig It Up",
    author: "retrozy",
    version: pkg.version
}