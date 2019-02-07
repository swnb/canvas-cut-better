const { getLoader } = require('react-app-rewired');

const tsImportPluginFactory = require('ts-import-plugin');
const rewireCssModules = require('react-app-rewire-css-modules-simple');
const rewireReactHotLoader = require('react-app-rewire-hot-loader');

const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
	.BundleAnalyzerPlugin;

module.exports = function override(config, env) {
	config = rewireCssModules(config, env);

	config = rewireCssModules.withLoaderOptions({
		localIdentName: '[local]___[hash:base64:5]'
	})(config, env);

	const tsLoader = getLoader(
		config.module.rules,
		rule =>
			rule.loader &&
			typeof rule.loader === 'string' &&
			rule.loader.includes('ts-loader')
	);

	tsLoader.options = {
		getCustomTransformers: () => ({
			before: [
				tsImportPluginFactory({
					libraryDirectory: 'es',
					libraryName: 'antd',
					style: 'css'
				})
			]
		})
	};

	config = rewireReactHotLoader(config, env);

	if (env === 'production' && !process.env['closeBundleAnalyz']) {
		if (!config.plugins) {
			config.plugins = [];
		}
		config.plugins.push(new BundleAnalyzerPlugin({ generateStatsFile: true }));
	}

	if (env === 'production') {
		config.devtool = '';
	}

	return config;
};
