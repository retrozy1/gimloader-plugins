<script lang="ts">
  import shared from './shared.svelte';
</script>

{#if shared.settingsState === 'home'}
  Join a game to configure settings.
{:else if shared.settingsState === 'playing'}
  You cannot change settings during a game.
{:else}
  <div>
    <label for="allowGuestEdits">Allow guests to edit settings</label>
    <input
      id="allowGuestEdits"
      type="checkbox"
      onchange={e => shared.send({ allowGuestEdits: e.currentTarget.checked })}
    >
  </div>
  <div>
    <label for="friendlyFire" title="Allows hunters to hit other hunters or runners to hit other runners.">Friendly fire</label>
    <input
      id="friendlyFire"
      type="checkbox"
      onchange={e => shared.send({ friendlyFire: e.currentTarget.checked })}  
    >
  </div>
  <div>
    <label for="frozenUntilRunnerMoves">Freeze hunters until the runner moves</label>
    <input
      id="frozenUntilRunnerMoves"
      type="checkbox"
      bind:checked={shared.settings.frozenUntilRunnerMoves}
    >
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