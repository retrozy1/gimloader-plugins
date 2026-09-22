import { pluginConfig } from '../../shared/config.ts';

export default pluginConfig({
	name: 'Prevent1DKick',
	description: 'prevents 1d kick',
	version: '1.0.0',
	gamemodes: ['1d'],
	input: 'src/index.ts',
	reloadRequired: 'ingame'
});
