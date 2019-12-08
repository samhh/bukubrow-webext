module.exports = {
	parser: '@typescript-eslint/parser',
	plugins: [
		'@typescript-eslint',
		'react',
		'jest',
	],
	extends: [
		'eslint:recommended',
		'plugin:@typescript-eslint/eslint-recommended',
		'plugin:@typescript-eslint/recommended',
		'plugin:@typescript-eslint/recommended-requiring-type-checking',
		'plugin:react/recommended',
	],
	parserOptions: {
		project: './tsconfig.json',
		ecmaVersion: 2018,
	},
	rules: {
		'@typescript-eslint/indent': [2, 'tab'],
		'@typescript-eslint/no-use-before-define': 0,
		'@typescript-eslint/no-misused-promises': 0,
		'@typescript-eslint/unbound-method': 0,
		'@typescript-eslint/array-type': [2, { default: 'generic', readonly: 'generic' }],
		'import/no-unresolved': 0,
		'react/prop-types': 0,
		'react/jsx-uses-react': 2,
		'react/jsx-uses-vars': 2,
		'react/display-name': 0,
		'no-confusing-arrow': 0,
		'no-console': 1,
	},
	env: {
		es6: true,
		browser: true,
		jest: true,
		'jest/globals': true,
	},
	globals: {
		page: true,
    browser: true,
    context: true,
	},
	settings: {
		react: {
			version: 'detect',
		},
	},
};

