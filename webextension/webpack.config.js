'use strict';

// Dependencies
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { TsConfigPathsPlugin } = require('awesome-typescript-loader');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
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
		template: './src/content/content.pug',
		chunks: ['content'],
	}),
	new HtmlWebpackPlugin({
		filename: 'options/options.build.html',
		template: './src/options/options.pug',
		chunks: ['options'],
	}),
	new ExtractTextPlugin({
		filename: '[name]/[name].build.css',
	}),
];

if (devMode) plugins.push(new CaseSensitivePathsPlugin());

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
		content: './src/content/content.tsx',
		options: './src/options/options.ts',
		backend: './src/backend/backend.ts',
	},
	output: {
		filename: '[name]/[name].build.js',
		path: `${__dirname}/dist/`,
	},
	module: {
		rules: [
			{
				test: /\.pug$/,
				use: [{
					loader: 'pug-loader',
					options: {
						pretty: devMode,
					},
				}],
			}, {
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
			{
				test: /\.css$/,
				use: ExtractTextPlugin.extract({
					use: [
						{
							loader: 'css-loader',
							options: {
								sourceMap: devMode,
								modules: true,
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
					],
				}),
			},
		],
	},
};
