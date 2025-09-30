import { pluginName } from "./consts";
import global from './global.svelte';
import { Ops, Types, type Payload } from "./messages";

api.net.onLoad(() => {
  const Communications = api.lib('Communications').Communications;
  const comms = new Communications(pluginName);
  comms.send(Ops.IHaveManhunt);

  const playersWithManhunt = new Set<any>([/*ME*/]);

  comms.onMessage((message, player) => {
    if (typeof message === 'number') {
      switch (message) {
        case Ops.IHaveManhunt: {
          playersWithManhunt.add(player);
          //Broadcast back to them that you have manhunt
          comms.send(Ops.IHaveManhunt);
          break;
        }
      }
    } else {
      const [type, payload]: [Types, Payload] = message;

      switch (type) {
        case Types.SettingsPatch: {
          global.setSettings({
            ...global.settings,
            ...payload
          });
          break;
        }
        case Types.HitRequest: {
          break;
        }
      }
    }
  });

  
});

function start() {

}