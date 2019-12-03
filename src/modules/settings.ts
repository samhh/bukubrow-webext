import { browser } from 'webextension-polyfill-ts';
import * as O from 'fp-ts/lib/Option';

export enum Theme {
	Light = 'light',
	Dark = 'dark',
}

export const isTheme = (arg: unknown): arg is Theme => (Object.values(Theme) as unknown[]).includes(arg);
const toMaybeTheme = (arg: unknown): Option<Theme> => isTheme(arg) ? O.some(arg) : O.none;

export enum BadgeDisplay {
	WithCount = 'with_count',
	WithoutCount = 'without_count',
	None = 'none',
}

export const isBadgeDisplayOpt = (arg: unknown): arg is BadgeDisplay => (Object.values(BadgeDisplay) as unknown[]).includes(arg);
const toMaybeBadgeDisplayOpt = (arg: unknown): Option<BadgeDisplay> => isBadgeDisplayOpt(arg) ? O.some(arg) : O.none;

export interface Settings {
	theme: Theme;
	badgeDisplay: BadgeDisplay;
}

export const saveSettings = (opts: Settings) => browser.storage.sync.set(opts);

const getSettings = (): Promise<Partial<Settings>> => browser.storage.sync.get();

export const getActiveTheme: Task<Option<Theme>> = () => getSettings()
	.then(({ theme }) => toMaybeTheme(theme));

export const getBadgeDisplayOpt: Task<Option<BadgeDisplay>> = () => getSettings()
	.then(({ badgeDisplay }) => toMaybeBadgeDisplayOpt(badgeDisplay));

