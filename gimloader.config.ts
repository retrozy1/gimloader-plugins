import { workspaceConfig } from '@gimloader/build';
import svelte from 'esbuild-svelte';
import { sveltePreprocess } from 'svelte-preprocess';

export default workspaceConfig({
	type: 'workspace',
	splitPluginsAndLibraries: true,
	autoAlias: ['./plugins'],
	plugins: [
		svelte({
			preprocess: sveltePreprocess(),
			compilerOptions: {
				css: 'injected'
			}
		})
	],
	esbuildOptions: {
		loader: {
			'.css': 'text',
			'.svg': 'text'
		}
	}
});
