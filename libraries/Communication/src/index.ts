import { gamemodeIdsWithoutAiming, Ops } from './consts';
import { floatToBytes, encodeStringMessage, getIdentifier, bytesToFloat } from './encoding';
import { Callback, Message, MessageState } from './types';
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
          })
        } else if (op === Ops.TransmittingByteInteger) {
          callbacksForIdentifier.forEach(({ callback }) => {
            callback(bytes[5], char);
          })
        } else {
          if (op === Ops.)
        }
      } else if (messageStates.) {

      }


      

      if (!messageStates.has(char)) {
        messageStates.set(char, {
          identifierString,
          charsRemaining: 0,
          message
        })
      }

      if (!callbacksForIdentifier)
    })
  })
})

let latestCallbackId = 0;
const callbacks = new Map<string, {
  callbackId: number,
  callback: Callback
}[]>();

export class Communication {
  identifier: number[];

  constructor (pluginName: string) {
    this.identifier = getIdentifier(pluginName);
  }

  send(message: Message) {
    switch (typeof message) {
      case 'number': {
        if (isUint8(message)) {
          const bytes = [
            ...this.identifier,
            Ops.TransmittingByteInteger,
            message
          ];

        }
        const messages = <number[]>encodeMessage(this.identifier, Ops.TransmittingNumber, String(message));
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
        const messages = <number[]>encodeMessage(this.identifier, Ops.TransmittingString, JSON.stringify(message));
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