<script lang="ts">
import type { IRecording } from 'client-plugins/plugins/InputRecorder/types';
import type { Ghost } from './types';

interface Props {
	initialGhosts: Ghost[];
	setGhosts: (ghosts: Ghost[]) => void;
}
const { initialGhosts, setGhosts }: Props = $props();

// svelte-ignore state_referenced_locally
let ghosts = $state(initialGhosts);

const updateGhosts = () => {
	setGhosts(ghosts);
};

function uploadJson<T = unknown>(): Promise<T> {
	return new Promise((resolve, reject) => {
		const input = document.createElement('input');
		input.type = 'file';
		input.accept = 'application/json';

		input.onchange = () => {
			const file = input.files?.[0];
			if (!file) {
				reject(new Error('No file selected'));
				return;
			}

			const reader = new FileReader();

			reader.onload = () => {
				try {
					const parsed = JSON.parse(reader.result as string);
					resolve(parsed as T);
				} catch (err) {
					reject(new Error('Invalid JSON file'));
				}
			};

			reader.onerror = () => {
				reject(new Error('Failed to read file'));
			};

			reader.readAsText(file);
		};

		input.click();
	});
}

async function addGhost() {
	try {
		const recording = await uploadJson<IRecording>();

		ghosts.push({
			enabled: true,
			mode: 'onTeleport',
			name: '',
			recording,
			skinId: '',
			id: crypto.randomUUID()
		});

		updateGhosts();

		api.UI.message.success({
			content: 'Added Ghost'
		});
	} catch (err: any) {
		api.UI.modal.error({
			content: err.message
		});
	}
}
</script>


{#if ghosts.length > 0}
  <table>
    <thead>
      <tr>
        <th>Enabled</th>
        <th>Start Mode</th>
        <th>Name</th>
        <th>Skin ID</th>
        <th></th>
      </tr>
    </thead>
    <tbody>
      {#each ghosts as ghost (ghost.id)}
        <tr>
          <td>
            <input type="checkbox" bind:checked={ghost.enabled}>
          </td>
          <td>
            <select bind:value={ghost.mode} onchange={updateGhosts}>
              <option value="onTeleport">On Teleport</option>
              <option value="onMovementAfterTeleport">On Movement</option>
            </select>
          </td>
          <td>
            <input bind:value={ghost.name} onchange={updateGhosts}>
          </td>
          <td>
            <input bind:value={ghost.skinId} onchange={updateGhosts}>
          </td>
          <td>
            <button title="Delete Ghost" onclick={() => {
              const index = ghosts.indexOf(ghost);
              if (index !== -1) ghosts.splice(index, 1);
              updateGhosts();
            }}>
              <i class="fas fa-trash"></i>
            </button>
          </td>
        </tr>
      {/each}
    </tbody>
  </table>
{/if}
<div class="flex items-center justify-center">
  <button class="border-2 rounded-md" onclick={addGhost}>Upload Input Recording</button>
</div>