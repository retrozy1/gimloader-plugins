<script lang="ts">
  import global from './global.svelte';
</script>

{#if global.settingsState === 'home'}
  Join a game to configure settings.
{:else if global.settingsState === 'playing'}
  You cannot change settings during a game.
{:else}
  <div>
    <label for="allowGuestEdits">Allow guests to edit settings</label>
    <input id="allowGuestEdits" type="checkbox" bind:checked={global.settings.allowGuestEdits}>
  </div>
  <div>
    <label for="friendlyFire" title="Allows hunters to hit other hunters or runners to hit other runners.">Friendly fire</label>
    <input id="friendlyFire" type="checkbox" bind:checked={global.settings.friendlyFire}>
  </div>
  <div>
    <label for="frozenUntilRunnerMoves">Freeze hunters until the runner moves</label>
    <input id="frozenUntilRunnerMoves" type="checkbox" bind:checked={global.settings.frozenUntilRunnerMoves}>
  </div>
  <div>
    <label for="hitRange">Hit range</label>
    <input id="hitRange" type="number" bind:value={global.settings.hitRange}>
  </div>
  <div>
    <label for="runnersCanHit">Allow runners to hit</label>
    <input id="runnersCanHit" type="checkbox" bind:checked={global.settings.runnersCanHit}>
  </div>
<!-- TEAMS -->
{/if}