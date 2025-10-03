<script lang="ts">
  import shared from './shared.svelte';
  import { Types } from './messages';
  import type { Settings } from './types';

  type InputEvent = Event & {
    currentTarget: EventTarget & HTMLInputElement;
  }

  function switchTeam(id: string) {
    const runnerIds = shared.settings.runnerIds;

    if (runnerIds.includes(id)) {
      shared.patchSettings({
        runnerIds: runnerIds.filter(r => r !== id)
      });
    } else {
      shared.patchSettings({
        runnerIds: [...runnerIds, id]
      });
    }
  }
</script>

{#snippet inputPatcher(
  id: string,
  labelName: string,
  value: boolean | number,
  patch: Partial<Settings>,
  type: 'checkbox' | 'number' | 'range',
  max?: number
)}
  <div>
    <label for={id}>{labelName}</label>
    <input {id} {type} {value} {max} onchange={e => shared.send([Types.SettingsPatch, patch])}>
  </div>
{/snippet}

{#if shared.settingsState === 'home'}
  Join a game to configure settings.
{:else if shared.settingsState === 'playing'}
  You cannot change settings during a game.
{:else}
  <div>
    {@render inputPatcher(
      'allowGuestEdits',
      'Allow guest edits',
      shared.settings.allowGuestEdits,
      {
        allowGuestEdits: 
      },
      'checkbox'
    )}
    {#if shared.settings.allowGuestEdits}
      <div class="italic">Click a player to switch their team</div>
    {/if}
    <div class="flex flex-col">
      <div>
        Hunters
        {#each shared.hunters as [id, name]}
          <button onclick={() => switchTeam(id)}>
            {name}
          </button>
        {/each}

        {@render inputPatcher()}
        
      </div>
      <div>
        Runners
        {#each shared.runners as [id, name]}
          <button onclick={() => switchTeam(id)}>
            {name}
          </button>
        {/each}
      </div>
    </div>
    <div>

    </div>
  </div>
<!-- TEAMS -->
{/if}