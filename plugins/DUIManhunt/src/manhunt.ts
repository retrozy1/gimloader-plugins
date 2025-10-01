import type { Position, Settings } from "./types";
import globals from './global.svelte';
import type { Ops } from './messages';

//The runtime of the manhunt
export default class Manhunt {
  private myId: string;
  private myTeam: 'hunter' | 'runner';
  private runnerIds = globals.settings.runnerIds;
  private hunterIds: string[];

  private projectileHandler = (projectile: any) => {
    const swing = projectile.added[0];

    const dismissConditions: boolean[] = [
      //This was my swing
      swing.ownerId === this.myId,
      //It was a swing from someone on my team and friendly fire is off
      !globals.settings.friendlyFire && (
        (
          this.myTeam === 'hunter' && this.hunterIds.includes(swing.ownerId)
        ) || (
          this.myTeam === 'runner' && this.runnerIds.includes(swing.ownerId)
        )
      )
    ];

    if (dismissConditions.some(c => c)) return;

    const myPosition: Position = api.stores.phaser.mainCharacter.body;
    const swingStartPosition: Position = swing.start;
    const swingEndPosition: Position = swing.end;

    const 
  }

  stop: () => void;

  constructor (private sendOp: (op: Ops) => void) {
    this.myId = api.stores.network.authId;

    const playerIdsInGame = Array.from<string>(api.stores.characters.characters.data_.keys());
    this.hunterIds = playerIdsInGame.filter(id => !this.runnerIds.includes(id));
    this.myTeam = this.hunterIds.includes(this.myId) ? 'hunter' : 'runner';

    const { off } = api.net.on('PROJECTILE_CHANGES', this.projectileHandler);
    this.stop = () => {
      off('PROJECTILE_CHANGES', this.projectileHandler)
    }
  }
}