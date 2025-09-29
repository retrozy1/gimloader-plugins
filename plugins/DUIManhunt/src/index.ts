import { send } from "process";

enum Ops {
  ThisIsManhuntLobby,
  IHaveManhunt
}

api.net.onLoad(() => {
  const Communications = api.lib('Communications').Communications;
  const comms = new Communications('DUIManhunt');

  comms.onMessage((message, player) => {
    if (typeof message === 'number') {
      switch (message) {
        case Ops.ThisIsManhuntLobby: {
          start();
          break;
        }
        case Ops.IHaveManhunt: {
          if (!api.net.isHost) return;
          break;
        }
      }
    } else {
      
    }
  })

  if (api.net.isHost) {
    comms.send(Ops.ThisIsManhuntLobby);
  }
});

function start() {

}