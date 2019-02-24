const tsconfig = require('./tsconfig.json');

const aliases = Object.entries(tsconfig.compilerOptions.paths).reduce((acc, [tsAlias, [tsPath]]) => {
	const matcher = '^' + tsAlias.replace(/\/\*$/, '/(.*)$');
	const target = tsPath.replace(/^\.\//, '<rootDir>/src/').replace(/\/\*$/, '/$1');

	acc[matcher] = target;

	return acc;
}, {});

module.exports = {
	preset: 'jest-puppeteer',
	setupFiles: ['jest-webextension-mock'],
	transform: {
		'\\.tsx?$': 'ts-jest',
		'\\.svg$': 'jest-raw-loader',
	},
	testRegex: '^.+\\.test.tsx?$',
	moduleFileExtensions: ['js', 'ts', 'tsx'],
	moduleNameMapper: aliases,
};
