'use strict';

// Dependencies
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { TsConfigPathsPlugin } = require('awesome-typescript-loader');
const CSSPlugin = require('mini-css-extract-plugin');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const autoprefixer = require('autoprefixer');

module.exports = (env) => {
	// Only utilise some features in certain environments
	const devMode = process.env.NODE_ENV !== 'production';
	const serverMode = env.SERVER_MODE;

	// Don't use an eval() source map, it will breach default
	// content_security_policy. Whilst that key could be changed in the manifest
	// it's better to just use these slightly slower non-eval sourcemaps
	const devtool = devMode ? 'cheap-module-source-map' : false;

	const plugins = [
		new CopyWebpackPlugin([
			{ from: './src/assets/', to: 'assets/' },
			{ from: './src/manifest.json' },
		]),
		new HtmlWebpackPlugin({
			filename: 'content/content.build.html',
			template: './src/template.html',
			chunks: [
				serverMode ? 'webextensionEnv' : undefined,
				'content',
			],
			// Ensure the webextensionEnv mock is placed in DOM ahead of other scripts
			chunksSortMode: (a, _b) => a.name === 'webextensionEnv' ? -1 : 1,
		}),
		new HtmlWebpackPlugin({
			filename: 'options/options.build.html',
			template: './src/template.html',
			chunks: ['options'],
		}),
		serverMode ? new HtmlWebpackPlugin({
			filename: 'index.html',
			template: './src/simulator.html',
			chunks: [],
		}) : undefined,
		new CSSPlugin({
			filename: '[name]/[name].build.css',
		}),
	];

	if (devMode) plugins.push(new CaseSensitivePathsPlugin());

	const genCSSLoadersConfig = (modulesEnabled) => [
		CSSPlugin.loader,
		{
			loader: 'css-loader',
			options: {
				sourceMap: devMode,
				modules: modulesEnabled ? 'local' : false,
				importLoaders: 1,
			},
		},
		{
			loader: 'postcss-loader',
			options: {
				plugins: () => [
					autoprefixer({
						browsers: [
							'Chrome >= 55',
							'Firefox >= 52',
						],
					}),
				],
			},
		},
	];

	const cfg = {
		devtool,
		devServer: {
			contentBase: './dist/',
		},
		plugins,
		context: __dirname,
		mode: devMode ? 'development' : 'production',
		target: 'web',
		resolve: {
			extensions: ['.ts', '.tsx', '.js', '.css'],
			plugins: [new TsConfigPathsPlugin()],
		},
		entry: {
			content: './src/apps/content',
			options: './src/apps/options',
			backend: './src/backend/backend.ts',
			webextensionEnv: './src/webextension-env.ts',
		},
		output: {
			filename: '[name]/[name].build.js',
			path: `${__dirname}/dist/`,
		},
		module: {
			rules: [{
					test: /\.svg$/,
					loader: 'svg-inline-loader',
				},
				{
					enforce: 'pre',
					test: /\.tsx?$/,
					loader: 'eslint-loader',
					exclude: /node_modules/,
				},
				{
					test: /\.tsx?$/,
					loader: 'awesome-typescript-loader',
					exclude: /node_modules/,
				},
				// *global.css is global, all other .css is locally scoped
				{
					test: /global\.css$/,
					use: genCSSLoadersConfig(false),
				},
				{
					test: /(?<!global).css$/,
					use: genCSSLoadersConfig(true),
				},
			],
		},
	};

	return cfg;
};
