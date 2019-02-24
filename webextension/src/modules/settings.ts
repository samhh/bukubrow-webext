import { browser } from 'webextension-polyfill-ts';
import { Just, Nothing } from 'purify-ts/Maybe';

export enum Theme {
	Light = 'light',
	Dark = 'dark',
}

export const isTheme = (arg: unknown): arg is Theme => Object.values(Theme).includes(arg);

export interface Settings {
	theme: Theme;
}

export const saveSettings = (opts: Partial<Settings>) => browser.storage.sync.set(opts);

const getSettings = (): Promise<Partial<Settings>> => browser.storage.sync.get();

export const getActiveTheme = () => getSettings().then(res => isTheme(res.theme)
	? Just(res.theme)
	: Nothing,
);
