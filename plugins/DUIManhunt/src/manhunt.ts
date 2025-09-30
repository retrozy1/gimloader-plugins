import type { Settings } from "./types";

//The in-game runtime of the manhunt
export default class Manhunt {
  pendingHits = new Map<number, any>();

  constructor (private settings: Settings, sendHit) {
    api.net.on('PROJECTILE_CHANGE', (v => {
      //logic
    }));

  }

  

}