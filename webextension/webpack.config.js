'use strict';

// Dependencies
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { TsConfigPathsPlugin } = require('awesome-typescript-loader');
const CSSPlugin = require('mini-css-extract-plugin');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const autoprefixer = require('autoprefixer');

// Only utilise some features during development
const devMode = process.env.NODE_ENV !== 'production';

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
		chunks: ['content'],
	}),
	new HtmlWebpackPlugin({
		filename: 'options/options.build.html',
		template: './src/template.html',
		chunks: ['options'],
	}),
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

module.exports = {
	devtool,
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
	},
	output: {
		filename: '[name]/[name].build.js',
		path: `${__dirname}/dist/`,
	},
	module: {
		rules: [{
				test: /\.svg$/,
				use: ['svg-inline-loader'],
			},
			{
				enforce: 'pre',
				test: /\.tsx?$/,
				use: [{
					loader: 'tslint-loader',
				}],
				exclude: /node_modules/,
			},
			{
				test: /\.tsx?$/,
				use: ['awesome-typescript-loader'],
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
