import { pluginName } from "./consts";
import global from './global.svelte';
import { Ops, Types, type Payload } from "./messages";
import Settings from './Settings.svelte';

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
const div = document.createElement('div');
const settings = new Settings({
  target: div
});

api.openSettingsMenu(() => {
  api.UI.showModal()
})