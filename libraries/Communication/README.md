# Usage

## Importing

Library: `"Communication | https://raw.githubusercontent.com/retrozy1/gimloader-plugins/refs/heads/main/libraries/Communication/src/build/build.js"`

Typescript types: `npm i -D "git+https://github.com/retrozy/gimloader-plugins.git#main:libraries/Communication"`

## Messaging

Messages can be any type supported in JSON. Unless the message is a boolean or a number being an unsigned integer byte (0-255)

```ts
import type { Communications } from 'communication';

const Communications: Communications = api.lib('Communication').Communications;

//Plugin name as the constructor argument, used internally to differentiate plugins
const comms = new Communications('MyPlugin');

//Fast method (one internal WS message)
enum Ops {
  Hello,
  Bye
}
comms.send(Ops.Hello);
comms.send(Ops.Bye);

//Slower method (multiple internal WS messages)
comms.send('Hello');
comms.send('Bye');

//You can have multiple `onMessage` callbacks. They return a function to remove themself.
const stopMessage = comms.onMessage((message, player) => {
  switch (message) {
    case Ops.Hello: {
      console.log(`${player.name} said hello!`);
    }
  }
});

api.onStop(stopMessage)
```

Whenever possible, you should try to make your message a **1 byte unsigned integer** (a whole number 0-255, use TypeScript enums) in cases where you care about speed. You can learn more about that below.

# How this works

Messages are sent in fake projectile aming (like weapons or pickaxes). Angles can be 8-byte floats, but they are capped at `1e9` meaning that the code here only sends 7 bytes per message.

When sending either a boolean or a 1-byte integer, messages are sent with a single buffer, which includes
- 0 - 3: The identifier of the plugin sending the message, and that it isn't just a real angle. The identifier is 4 bytes derived from the plugin name when the class is contructed so plugins don't have to worry about it.
- 2: Opcode enum (what type of message is being sent), which includes:
  - TransmittingByteInteger
  - TransmittingBoolean
  - TransmittingNumber
  - TransmittingString
  - TransmittingObject
But for this case it would only be TransmittingByteInteger or TransmittingBoolean.
- 3: Payload. If the opcode was a boolean this would just be 0/1, and if it was an integer it would be the integer.

When sending a number over 1-byte, a string, or an object, it is converted to a string and sent through multiple buffers, which includes a header and the payloads following it. When multiple messages are sent at once (among all plugins), the library stores them in a queue. Between messages in queue, the real angle is stored and sent (unless the gamemode doesn't have aiming).
- **Header**
  - 0 - 3: The identifier of the plugin.
  - 4: The opcode so the receiver knows how to parse the string.
  - 5: The high characters. This and the low characters lets the receiver know how long the payload will be, so there doesn't have to be any "finished" message at the end.
  - 6: The low characters.
- **...Paylod buffers**
  - 0 - 6: The string character codes. It filters out the strings that are over a byte.

In the future I may add
- Allow 2 bytes for numbers since there's still an empty slot.
- Allow single-message 2-byte strings.
- Automatically find if the gamemode or creative map has aiming instead of having a defined list of official gamemodes that don't.