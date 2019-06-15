import { browser } from 'webextension-polyfill-ts';
import { Just, Nothing } from 'purify-ts/Maybe';
import { MaybeAsync } from 'purify-ts/MaybeAsync';

export enum Theme {
	Light = 'light',
	Dark = 'dark',
}

export const isTheme = (arg: unknown): arg is Theme => Object.values(Theme).includes(arg);

export enum BadgeDisplay {
	WithCount = 'with_count',
	WithoutCount = 'without_count',
	None = 'none',
}

export const isBadgeDisplayOpt = (arg: unknown): arg is BadgeDisplay => Object.values(BadgeDisplay).includes(arg);

export interface Settings {
	theme: Theme;
	badgeDisplay: BadgeDisplay;
}

export const saveSettings = (opts: Settings) => browser.storage.sync.set(opts);

const getSettings = (): Promise<Partial<Settings>> => browser.storage.sync.get();

export const getActiveTheme = () => MaybeAsync(({ liftMaybe }) => getSettings().then(res => liftMaybe(isTheme(res.theme)
	? Just(res.theme)
	: Nothing)));

export const getBadgeDisplayOpt = () => MaybeAsync(({ liftMaybe }) => getSettings().then(res => liftMaybe(isBadgeDisplayOpt(res.badgeDisplay)
	? Just(res.badgeDisplay)
	: Nothing)));

