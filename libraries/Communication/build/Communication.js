/**
 * @name Communication
 * @description Communication between different clients in 2D gamemodes
 * @author retrozy
 * @version 1.0.0
 * @isLibrary true
 */

// src/consts.ts
var gamemodeIdsWithoutAiming = [
  "dontlookdown"
];

// src/encoding.ts
function bytesToFloat(bytes) {
  let buffer = new ArrayBuffer(8);
  let view = new Uint8Array(buffer);
  for (let i = 0; i < 7; i++) {
    view[i] = bytes[i] ?? 0;
  }
  return new Float64Array(buffer)[0];
}
function floatToBytes(float) {
  let buffer = new ArrayBuffer(8);
  let floatView = new Float64Array(buffer);
  floatView[0] = float;
  let byteView = new Uint8Array(buffer);
  return Array.from(byteView);
}
function getIdentifier(pluginName) {
  let hash = 0;
  for (let i = 0; i < pluginName.length; i++) {
    const charCode = pluginName.charCodeAt(i);
    hash = hash * 31 + charCode | 0;
  }
  const uInt32Hash = hash >>> 0;
  return [
    uInt32Hash >>> 24 & 255,
    uInt32Hash >>> 16 & 255,
    uInt32Hash >>> 8 & 255,
    uInt32Hash & 255
  ];
}
function encodeStringMessage(identifier, op, message) {
  let codes = message.split("").map((c) => c.charCodeAt(0));
  codes = codes.filter((c) => c < 256);
  let charsLow = codes.length & 255;
  let charsHigh = (codes.length & 65280) >> 8;
  let header = [...identifier, op, charsHigh, charsLow];
  let messages = [bytesToFloat(header)];
  while (codes.length % 7 !== 0) codes.push(0);
  for (let i = 0; i < codes.length; i += 7) {
    let msg = [];
    for (let j = 0; j < 7; j++) {
      msg[j] = codes[i + j];
    }
    messages.push(bytesToFloat(msg));
  }
  return messages;
}

// src/util.ts
function isUint8(n) {
  return Number.isInteger(n) && n >= 0 && n <= 255;
}

// src/index.ts
var sending = false;
var pendingAngle = 0;
var ignoreNextAngle = false;
var noAiming = false;
function sendAngle(angle) {
  api.net.send("AIMING", { angle });
}
function sendMessages(messages) {
  sending = true;
  for (const message of messages) {
    ignoreNextAngle = true;
    sendAngle(message);
  }
  sending = false;
  if (!noAiming) sendAngle(pendingAngle);
}
api.net.onLoad((_, gamemode) => {
  const myId = api.stores.network.authId;
  noAiming = gamemodeIdsWithoutAiming.includes(gamemode);
  if (!noAiming) {
    api.net.on("send:AIMING", (message, editFn) => {
      if (!sending) return;
      if (ignoreNextAngle) {
        ignoreNextAngle = false;
        return;
      }
      pendingAngle = message.angle;
      editFn(null);
    });
  }
  const messageStates = /* @__PURE__ */ new Map();
  api.net.room.state.characters.onAdd((char) => {
    if (char.id === myId) return;
    char.projectiles.listen("aimAngle", (angle) => {
      if (angle === 0) return;
      const bytes = floatToBytes(angle);
      const identifierBytes = bytes.slice(0, 4);
      const identifierString = JSON.stringify(identifierBytes);
      const callbacksForIdentifier = callbacks.get(identifierString);
      if (callbacksForIdentifier) {
        const op = identifierBytes[4];
        if (op === 1 /* TransmittingBoolean */) {
          callbacksForIdentifier.forEach(({ callback }) => {
            callback(bytes[5] === 1, char);
          });
        } else if (op === 0 /* TransmittingByteInteger */) {
          callbacksForIdentifier.forEach(({ callback }) => {
            callback(bytes[5], char);
          });
        } else {
          const high = bytes[5];
          const low = bytes[6];
          messageStates.set(char, {
            message: "",
            charsRemaining: Math.min(1e3, (high << 8) + low),
            identifierString,
            op
          });
        }
      } else if (messageStates.has(char)) {
        const state = messageStates.get(char);
        for (let i = 0; i < Math.min(7, state.charsRemaining); i++) {
          state.message += String.fromCharCode(bytes[i]);
        }
        state.charsRemaining -= 7;
        if (state.charsRemaining <= 0) {
          const stateCallbacks = callbacks.get(state.identifierString);
          if (!stateCallbacks) return;
          let message;
          switch (state.op) {
            case 2 /* TransmittingNumber */: {
              message = Number(state.message);
              break;
            }
            case 4 /* TransmittingObject */: {
              message = JSON.parse(state.message);
              break;
            }
            case 3 /* TransmittingString */: {
              message = state.message;
              break;
            }
          }
          stateCallbacks.forEach(({ callback }) => {
            callback(message, char);
          });
          callbacks.delete(char);
        }
      }
    });
  });
});
var latestCallbackId = 0;
var callbacks = /* @__PURE__ */ new Map();
var Communications = class {
  identifier;
  constructor(pluginName) {
    this.identifier = getIdentifier(pluginName);
  }
  send(message) {
    switch (typeof message) {
      case "number": {
        if (isUint8(message)) {
          const bytes = [
            ...this.identifier,
            0 /* TransmittingByteInteger */,
            message
          ];
          sendMessages([bytesToFloat(bytes)]);
          return;
        }
        const messages = encodeStringMessage(this.identifier, 2 /* TransmittingNumber */, String(message));
        sendMessages(messages);
        break;
      }
      case "string": {
        const messages = encodeStringMessage(this.identifier, 3 /* TransmittingString */, message);
        if (messages) sendMessages(messages);
        break;
      }
      case "boolean": {
        const bytes = [
          ...this.identifier,
          1 /* TransmittingBoolean */,
          message ? 1 : 0
        ];
        sendAngle(bytesToFloat(bytes));
        break;
      }
      case "object": {
        const messages = encodeStringMessage(this.identifier, 3 /* TransmittingString */, JSON.stringify(message));
        sendMessages(messages);
        break;
      }
    }
  }
  onMessage(callback) {
    const identifierString = JSON.stringify(this.identifier);
    const callbackId = latestCallbackId;
    latestCallbackId++;
    if (!callbacks.get(identifierString)) {
      callbacks.set(identifierString, []);
    }
    const pluginCallbacks = callbacks.get(identifierString);
    pluginCallbacks.push({
      callbackId,
      callback
    });
    return () => {
      pluginCallbacks.filter((c) => c.callbackId !== callbackId);
    };
  }
};
export {
  Communications
};
