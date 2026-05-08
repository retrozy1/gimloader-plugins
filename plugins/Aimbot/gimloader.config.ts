import { pluginConfig } from '../../shared/config.ts';

export default pluginConfig({
	name: 'Aimbot',
	description: 'Automatically aims your weapon at the closest target',
	version: '1.0.1',
	gamemodes: ['2d'],
	input: 'src/index.ts',
	hasSettings: true,
	changelog: [
		'Made the pointer work normally when the plugin is disabled',
		'Added settings for which characters should be targets'
	]
});
