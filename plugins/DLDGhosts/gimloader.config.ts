import { pluginConfig } from '../../shared/config.ts';

export default pluginConfig({
	name: 'DLDGhosts',
	description: 'Allows making live ghosts to compare with runs in DLD',
	version: '0.1.0',
	gamemodes: ['dontlookdown'],
	needsPlugins: [
		'Savestates | https://raw.githubusercontent.com/Gimloader/client-plugins/refs/heads/main/build/plugins/Savestates.js'
	]
});
