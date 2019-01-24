import { browser } from 'webextension-polyfill-ts';

export enum Theme {
	Light = 'light',
	Dark = 'dark',
}

const isTheme = (arg: unknown): arg is Theme => Object.values(Theme).includes(arg);

export const getActiveTheme = () => browser.storage.sync.get().then(res => isTheme(res.theme) ? res.theme : Theme.Light);

export const setTheme = (theme: Theme) => {
	const action = theme === 'dark'
		? 'add'
		: 'remove';

	document.body.classList[action]('dark');
};
