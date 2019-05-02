import { browser } from 'webextension-polyfill-ts';
import { Just, Nothing } from 'purify-ts/Maybe';
import { MaybeAsync } from 'purify-ts/MaybeAsync';

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

export const getActiveTheme = () => MaybeAsync(({ liftMaybe }) => getSettings().then(res => liftMaybe(isTheme(res.theme)
	? Just(res.theme)
	: Nothing)));
