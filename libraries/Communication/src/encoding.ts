import { Ops } from "./consts";

// always requires 7 bytes as input
export function bytesToFloat(bytes: number[]) {
  let buffer = new ArrayBuffer(8);
  let view = new Uint8Array(buffer);

  // the last byte is always 0 since angles are capped at 1e9, and this always makes the exponent negative
  for (let i = 0; i < 7; i++) {
    view[i] = bytes[i] ?? 0;
  }

  return new Float64Array(buffer)[0];
}

export function floatToBytes(float: number) {
  let buffer = new ArrayBuffer(8);
  let floatView = new Float64Array(buffer);
  floatView[0] = float;

  let byteView = new Uint8Array(buffer);
  return Array.from(byteView);
}

//Deterministically generates 4 numbers from a string (plugin name) as an identifier for who is sending messages
export function getIdentifier(name: string) {
  let hash = 0;

  for (let i = 0; i < name.length; i++) {
    hash = (hash * 31 + name.charCodeAt(i)) >>> 0;
  }

  return [
    (hash >>> 24) & 0xff,
    (hash >>> 16) & 0xff,
    (hash >>> 8) & 0xff,
    hash & 0xff,
  ];
}

export function encodeStringMessage(identifier: number[], message: string, activeOffsets?: number[]) {
  let codes = message.split('').map(c => c.charCodeAt(0));
  codes = codes.filter(c => c < 256);
  if (codes.length === 0) return;

  let charsLow = codes.length & 0xff;
  let charsHigh = (codes.length & 0xff00) >> 8;

  const arr = new Uint8Array(1);
  let offset = crypto.getRandomValues(arr)[0];
  while (activeOffsets?.includes(offset)) {
    offset = crypto.getRandomValues(arr)[0];
  }

  let header = [...identifier, offset, charsHigh, charsLow];

  let messages: number[] = [bytesToFloat(header)];

  // pad the codes to have a multiple of 7
  while (codes.length % 7 !== 0) codes.push(0);

  for (let i = 0; i < codes.length; i += 7) {
    let msg: number[] = [];
    for (let j = 0; j < 7; j++) {
      msg[j] = codes[i + j];
    }

    messages.push(bytesToFloat(msg));
  }

  return {
    messages,
    offset
  };
}