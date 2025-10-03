import shared from './shared.svelte';
import Manhunt from "./manhunt";
import { Ops, Types, type Payload } from "./messages";
import Settings from './Settings.svelte';
import type { notification } from "antd";

type Notification = typeof notification;

api.net.onLoad(() => {
  shared.send(Ops.IHaveManhunt);

  api.onStop(() => {
    shared.send(Ops.TurningOffManhunt);
  });

  const myId: string = api.stores.network.authId;
  const playerIdsWithManhunt = new Set([myId]);

  let runtime: Manhunt;

  shared.onMessage((message, player) => {
    if (typeof message === 'number') {
      switch (message) {
        case Ops.IHaveManhunt: {
          playerIdsWithManhunt.add(player.id);
          break;
        }
        case Ops.TurningOffManhunt: {
          playerIdsWithManhunt.delete(player.id);
          if (!runtime) return;

          (api.notification as Notification).error({
            message: `${player.name} has turned off manhunt. Manhunt has been disabled.`
          });
          runtime.stop();

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
          shared.setSettings(payload);
        }
        case Types.SettingsPatch: {
          shared.setSettings({
            ...shared.settings,
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
    runtime = new Manhunt(shared.send);
  });
  api.stores.phaser.onEnd(() => {
    runtime.stop();
    runtime = new Manhunt(shared.send);
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