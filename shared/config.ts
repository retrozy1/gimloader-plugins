import { type SingleConfig, singleConfig } from '@gimloader/build';

type DistributiveOmit<T, K extends keyof T> = T extends any
	? Omit<T, K>
	: never;
type ConfigInfo = DistributiveOmit<
	SingleConfig,
	'downloadUrl' | 'webpage' | 'author'
>;
type Category = 'libraries' | 'plugins';

export const baseDownloadUrl =
	'https://raw.githubusercontent.com/retrozy1/gimloader-plugins/main';

function mapDependency(category: Category) {
	return (dependency: string) => {
		if (dependency.includes('|')) return dependency;
		return `${dependency} | ${baseDownloadUrl}/${category}/${dependency}.js`;
	};
}

export function pluginConfig(info: ConfigInfo) {
	const { needsPlugins, needsLibs, optionalLibs, ...options } = info;

	const category: Category = info.isLibrary ? 'libraries' : 'plugins';
	const downloadUrl = `${baseDownloadUrl}/${category}/${info.name}.js`;

	const formattedNeedsPlugins = needsPlugins?.map(mapDependency('plugins'));
	const formattedNeedsLibs = needsLibs?.map(mapDependency('libraries'));
	const formattedOptionalLibs = optionalLibs?.map(mapDependency('libraries'));

	return singleConfig({
		...options,
		author: 'retrozy',
		downloadUrl,
		needsPlugins: formattedNeedsPlugins,
		needsLibs: formattedNeedsLibs,
		optionalLibs: formattedOptionalLibs
	});
}
