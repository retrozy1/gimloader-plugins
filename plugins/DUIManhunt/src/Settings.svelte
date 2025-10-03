<script lang="ts">
  import shared from './shared.svelte';
  import type { Settings } from './types';
</script>

{#if shared.settingsState === 'home'}
  Join a game to configure settings.
{:else if shared.settingsState === 'playing'}
  You cannot change settings during a game.
{:else}
  {#snippet simpleCheckbox(settingName: keyof Settings, label: string, title?: string)}
    <div>
      <label for={settingName} {title}>{label}</label>
      <input
        id={settingName}
        type="checkbox"
        value={shared.settings[settingName]}
        onchange={e => shared.send({ [settingName]: e.currentTarget.checked })}
      >
    </div>
  {/snippet}

  <div>
    {@render simpleCheckbox('allowGuestEdits', 'Guests can edit')}
    {@render simpleCheckbox('friendlyFire', 'Friendly fire', 'Allows players to hit players on their own team')}
    {@render simpleCheckbox('frozenUntilRunnerMoves', 'Freeze until runner moves')}
    {@render simpleCheckbox('runnersCanHit', 'Runners can hit hunters')}


    <div>
      <label for="hitRange">Hit range</label>
      <input
        id="hitRange"
        type="number"
        onchange={e => shared.send({ hitRange: e.currentTarget.valueAsNumber })}
      >
    </div>
  </div>
<!-- TEAMS -->
{/if}