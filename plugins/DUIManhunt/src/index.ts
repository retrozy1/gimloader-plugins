import { pluginName } from "./consts";
import global from './global.svelte';
import Manhunt from "./manhunt";
import { Ops, Types, type Payload } from "./messages";
import Settings from './Settings.svelte';
import type { notification } from "antd";

api.net.onLoad(() => {
  const Communications = api.lib('Communications').Communications;
  const comms = new Communications(pluginName);
  comms.send(Ops.IHaveManhunt);

  api.onStop(() => {
    comms.send(Ops.TurningOffManhunt);
  });

  const myId: string = api.stores.network.authId;
  const playerIdsWithManhunt = new Set([myId]);

  let runtime: Manhunt;

  comms.onMessage((message, player) => {
    if (typeof message === 'number') {
      switch (message) {
        case Ops.IHaveManhunt: {
          playerIdsWithManhunt.add(player.id);
          break;
        }
        case Ops.TurningOffManhunt: {
          playerIdsWithManhunt.delete(player.id);
          if (runtime) {
            (api.notification as typeof notification).error({
              message: `${player.name} has turned off manhunt. Manhunt is disabled.`
            })
          }
          runtime?.stop();

          break;
        }
        default: {
          runtime.handleHealthChange(player.id, message);
          break;
        }
      }
    } else {
      const [type, payload]: Payload = message;

      switch (type) {
        case Types.Settings: {
          global.setSettings(payload);
        }
        case Types.SettingsPatch: {
          global.setSettings({
            ...global.settings,
            ...payload
          });
          break;
        }
      }
    }
  });

  api.net.room.state.characters.onAdd((char: any) => {

  })

  //todo find these functions
  api.stores.phaser.onStart(() => {
    runtime = new Manhunt(comms.send);
  });
  api.stores.phaser.onEnd(() => {
    runtime.stop();
    runtime = new Manhunt(comms.send);
  });
});

const div = document.createElement('div');
new Settings({
  target: div
});

api.openSettingsMenu(() => {
  api.UI.showModal(div, {
    title: 'Manhunt settings',
    buttons: [{ text: 'close', style: 'close' }]
  });
});