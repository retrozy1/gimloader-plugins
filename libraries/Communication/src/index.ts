import { gamemodeIdsWithoutAiming, Ops } from './consts';
import { floatToBytes, encodeStringMessage, getIdentifier, bytesToFloat } from './encoding';
import type { Callback, Message, MessageState } from './types';
import { isUint8 } from './util';

let sending = false;
let pendingAngle = 0;
let ignoreNextAngle = false;
let noAiming = false;

function sendAngle(angle: number) {
  api.net.send("AIMING", { angle });
}

function sendMessages(messages: number[]) {
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

  //Prevent real angles from being overrided by messages
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

  const messageStates = new Map<any, MessageState>;

  api.net.room.state.characters.onAdd((char: any) => {
    if (char.id === myId) return;

    char.projectiles.listen('aimAngle', (angle: number) => {
      if (angle === 0) return;

      const bytes = floatToBytes(angle);
      const identifierBytes = bytes.slice(0, 4);
      const identifierString = JSON.stringify(identifierBytes);

      const callbacksForIdentifier = callbacks.get(identifierString);

      if (callbacksForIdentifier) {
        const op: Ops = identifierBytes[4];

        if (op === Ops.TransmittingBoolean) {
          callbacksForIdentifier.forEach(({ callback }) => {
            callback(bytes[5] === 1, char);
          });
        } else if (op === Ops.TransmittingByteInteger) {
          callbacksForIdentifier.forEach(({ callback }) => {
            callback(bytes[5], char);
          });
        } else {
          const high = bytes[5];
          const low = bytes[6];

          messageStates.set(char, {
            message: '',
            charsRemaining: Math.min(1000, (high << 8) + low),
            identifierString,
            op
          });
        }
      } else if (messageStates.has(char)) {
        const state = messageStates.get(char)!;

        // decode the message
        for (let i = 0; i < Math.min(7, state.charsRemaining); i++) {
          state.message += String.fromCharCode(bytes[i]);
        }
        state.charsRemaining -= 7;

        if (state.charsRemaining <= 0) {
          const stateCallbacks = callbacks.get(state.identifierString);
          if (!stateCallbacks) return;

          let message: Message;

          //Parse the message based on the op
          switch (state.op) {
            case Ops.TransmittingNumber: {
              message = Number(state.message);
              break;
            }
            case Ops.TransmittingObject: {
              message = JSON.parse(state.message);
              break;
            }
            case Ops.TransmittingString: {
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
    })
  })
})

let latestCallbackId = 0;
const callbacks = new Map<string, {
  callbackId: number,
  callback: Callback
}[]>();

export class Communications {
  identifier: number[];

  constructor(pluginName: string) {
    this.identifier = getIdentifier(pluginName);
  }

  send(message: Message) {
    switch (typeof message) {
      case 'number': {
        //Send in one message if the number is Uint8
        if (isUint8(message)) {
          const bytes = [
            ...this.identifier,
            Ops.TransmittingByteInteger,
            message
          ];
          sendMessages([bytesToFloat(bytes)]);
          return;
        }

        const messages = <number[]>encodeStringMessage(this.identifier, Ops.TransmittingNumber, String(message));
        sendMessages(messages);
        break;
      }
      case 'string': {
        const messages = encodeStringMessage(this.identifier, Ops.TransmittingString, message);
        if (messages) sendMessages(messages);
        break;
      }
      case 'boolean': {
        const bytes: number[] = [
          ...this.identifier,
          Ops.TransmittingBoolean,
          message ? 1 : 0
        ];

        sendAngle(bytesToFloat(bytes));
        break;
      }
      case 'object': {
        const messages = <number[]>encodeStringMessage(this.identifier, Ops.TransmittingString, JSON.stringify(message));
        sendMessages(messages);
        break;
      }
    }
  }

  onMessage(callback: Callback) {
    const identifierString = JSON.stringify(this.identifier);
    const callbackId = latestCallbackId;
    latestCallbackId++;

    if (!callbacks.get(identifierString)) {
      callbacks.set(identifierString, []);
    }

    const pluginCallbacks = callbacks.get(identifierString)!;

    pluginCallbacks.push({
      callbackId,
      callback
    });

    return () => {
      pluginCallbacks.filter(c => c.callbackId !== callbackId);
    };
  }
}