import { browser } from 'webextension-polyfill-ts';
import { Just, Nothing } from 'purify-ts/Maybe';

export enum Theme {
	Light = 'light',
	Dark = 'dark',
}

const isTheme = (arg: unknown): arg is Theme => Object.values(Theme).includes(arg);

export const getActiveTheme = () => browser.storage.sync.get().then(res => isTheme(res.theme)
	? Just(res.theme)
	: Nothing,
);

export const setTheme = (theme: Theme) => {
	const action = theme === 'dark'
		? 'add'
		: 'remove';

	document.body.classList[action]('dark');
};
