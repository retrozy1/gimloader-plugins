import { Ops } from "./consts";

/*
  How messages are sent:

*/

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

//Deterministically generates 2 numbers from a string (plugin name) as an identifier for who is sending messages
export function getIdentifier(pluginName: string) {
  let hash = 0;
  for (let i = 0; i < pluginName.length; i++) {
    const charCode = pluginName.charCodeAt(i);
    hash = (hash * 31 + charCode) | 0;
  }

  const uInt32Hash = hash >>> 0;

  return [
    (uInt32Hash >>> 24) & 0xFF,
    (uInt32Hash >>> 16) & 0xFF,
    (uInt32Hash >>> 8) & 0xFF,
    uInt32Hash & 0xFF
  ];
}



export function encodeStringMessage(identifier: number[], op: Ops, message: string) {
  let codes = message.split('').map(c => c.charCodeAt(0));
  codes = codes.filter(c => c < 256);

  let charsLow = codes.length & 0xff;
  let charsHigh = (codes.length & 0xff00) >> 8;

  let header = [...identifier, op, charsHigh, charsLow];

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

  return messages;
}