import { pluginConfig } from '../../shared/config.ts';

export default pluginConfig({
	name: 'Dash',
	description:
		"Allows you to dash and 'boost' your character in the direction you are facing",
	version: '0.1.0',
	needsPlugins: [
		'Desynchronize | https://raw.githubusercontent.com/Gimloader/client-plugins/refs/heads/main/build/plugins/Desynchronize.js'
	]
});
