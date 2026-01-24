import type { SingleConfig } from '@gimloader/build';

type PluginConfig = Omit<
	SingleConfig,
	| 'isLibrary'
	| 'type'
	| 'author'
	| 'downloadUrl'
	| 'webpage'
	| 'outdir'
	| 'input'
>;

export const pluginConfig = (config: PluginConfig): SingleConfig => ({
	...config,
	author: 'retrozy',
	input: 'src/index.ts',
	downloadUrl: `https://raw.githubusercontent.com/retrozy1/gimloader-plugins/main/build/plugins/${config.name}.js`
});
