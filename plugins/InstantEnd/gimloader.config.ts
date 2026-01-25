import { pluginConfig } from '../../shared/config.ts';

export default pluginConfig({
	name: 'InstantEnd',
	description: 'Instantly ends games you create when you close the tab',
	version: '1.0.1',
	changelog: ['Allowed ending instantly when in lobby'],
	gamemodes: ['2d']
});
