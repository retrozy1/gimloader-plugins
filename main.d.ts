declare module '*.svelte' {
	const component: import('svelte').SvelteComponent;
	export default component;
}

declare namespace Gimloader {
	interface Plugins {
		Savestates: typeof import('./node_modules/client-plugins/plugins/Savestates/src');
	}
}
