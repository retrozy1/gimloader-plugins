import type { Position } from "./types";
import shared from './shared.svelte';
import { freeze } from './freeze';

//The runtime of the manhunt
export default class Manhunt {
  private playerHealths = new Map<string, number>;
  private runnerIds = shared.settings.runnerIds;

  private get runnerHealths() {
    const runnerHealths: number[] = [];
    this.runnerIds.forEach(id => {
      runnerHealths.push(this.playerHealths.get(id)!);
    })
    return runnerHealths;
  }

  private get me() {
    const myId: string = api.stores.network.authId;

    return {
      id: myId,
      team: this.hunterIds.includes(myId) ? 'hunter' : 'runner' as 'hunter' | 'runner',
      health: this.playerHealths.get(myId)!,
      position: api.stores.phaser.mainCharacter.body as Position
    };
  }

  private get hunterIds() {
    const playerIdsInGame = Array.from<string>(api.stores.characters.characters.data_.keys());
    return playerIdsInGame.filter(id => !this.runnerIds.includes(id));
  }

  stop: () => void;

  constructor (private send: (num: number) => void) {
    this.runnerIds.forEach(id => {
      this.playerHealths.set(id, shared.settings.runnerHealth);
    });
    this.hunterIds.forEach(id => {
      this.playerHealths.set(id, shared.settings.hunterHealth);
    });

    const { off } = api.net.on('PROJECTILE_CHANGES', this.projectileHandler);
    this.stop = () => {
      off('PROJECTILE_CHANGES', this.projectileHandler)
    }

    if (this.me.team === 'hunter' && shared.settings.frozenUntilRunnerMoves) {
      //todo
    }
  }

  //Handle any pickaxe being swung
  private projectileHandler = (projectile: any) => {
    const swing = projectile.added[0];

    const dismissConditions: boolean[] = [
      //This was my swing
      swing.ownerId === this.me.id,
      //I'm dead
      this.me.health <= 0,
      //It was a swing from someone on my team and friendly fire is off
      !shared.settings.friendlyFire && (
        (
          this.me.team === 'hunter' && this.hunterIds.includes(swing.ownerId)
        ) || (
          this.me.team === 'runner' && this.runnerIds.includes(swing.ownerId)
        )
      )
    ];

    if (dismissConditions.some(c => c)) return;

    const { x, y } = this.me.position;
    const swingStartPosition: Position = swing.start;
    const swingEndPosition: Position = swing.end;

    const wasHitConditions: boolean[] = [
      (x - shared.settings.hitRange) <= swingStartPosition.x,
      (x + shared.settings.hitRange) >= swingStartPosition.x,
      (x - shared.settings.hitRange) <= swingEndPosition.x,
      (x + shared.settings.hitRange) >= swingEndPosition.x,
      //Y is reversed; ground is larger and sky is smaller
      (y - shared.settings.hitRange) >= swingStartPosition.y,
      (y + shared.settings.hitRange) <= swingStartPosition.y,
      (y - shared.settings.hitRange) >= swingEndPosition.y,
      (y + shared.settings.hitRange) <= swingEndPosition.y
    ];

    if (!wasHitConditions.some(c => c)) return;

    this.send(swing.damage);
    this.handleHealthChange(this.me.id, swing.damage)
  }
  
  handleHealthChange(charId: string, deductHealth: number) {
    const playerHealth = this.playerHealths.get(charId)!;
    const newHealth = playerHealth - deductHealth;
    this.playerHealths.set(charId, newHealth);

    if (this.runnerHealths.every(health => health <= 0)) {
      this.stop();

      if (api.net.isHost) {
        GL.net.send('END_GAME', undefined);
      }
      return;
    }

    if (this.me.health <= 0) {
      freeze();
    }
  }
}