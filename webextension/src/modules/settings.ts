import { browser } from 'webextension-polyfill-ts';

export enum Theme {
	Light = 'light',
	Dark = 'dark',
}

export interface Settings {
	theme: Theme;
}

export const saveSettings = (opts: Partial<Settings>) => browser.storage.sync.set(opts);

export const getSettings = (): Promise<Partial<Settings>> => browser.storage.sync.get();
