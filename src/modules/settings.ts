import { browser } from 'webextension-polyfill-ts';
import * as t from 'io-ts';
import { optionFromNullable } from 'io-ts-types/lib/optionFromNullable';
import { fromRefinement } from 'io-ts-types/lib/fromRefinement';
import { Lens } from 'monocle-ts';
import { pipe } from 'fp-ts/lib/pipeable';
import { flow, constant } from 'fp-ts/lib/function';
import { eqString } from 'fp-ts/lib/Eq';
import * as T from 'fp-ts/lib/Task';
import * as TE from 'fp-ts/lib/TaskEither';
import * as E from 'fp-ts/lib/Either';
import * as O from 'fp-ts/lib/Option';
import { elemC } from 'Modules/array';
import { values } from 'Modules/record';
import { error } from 'Modules/error';
import { decode } from 'Modules/io';

export enum Theme {
	Light = 'light',
	Dark = 'dark',
}

export const isTheme: Refinement<string, Theme> = (arg): arg is Theme => pipe(
	values(Theme),
	elemC(eqString)(arg),
);

const themeCodec = fromRefinement<Theme>(
	'theme',
	(x): x is Theme => t.string.is(x) && isTheme(x),
);

export enum BadgeDisplay {
	WithCount = 'with_count',
	WithoutCount = 'without_count',
	None = 'none',
}

export const isBadgeDisplayOpt: Refinement<string, BadgeDisplay> = (arg): arg is BadgeDisplay => pipe(
	values(BadgeDisplay),
	elemC(eqString)(arg),
);

const badgeDisplayCodec = fromRefinement<BadgeDisplay>(
	'badgeDisplay',
	(x): x is BadgeDisplay => t.string.is(x) && isBadgeDisplayOpt(x),
);

const settingsCodec = t.type({
	theme: optionFromNullable(themeCodec),
	badgeDisplay: optionFromNullable(badgeDisplayCodec),
});

export type Settings = t.TypeOf<typeof settingsCodec>;

const theme = Lens.fromProp<Settings>()('theme');
const badgeDisplay = Lens.fromProp<Settings>()('badgeDisplay');

export const saveSettings = (opts: Settings): Task<void> => (): Promise<void> =>
	browser.storage.sync.set(opts);

const getSettings: TaskEither<Error, Settings> = pipe(
	TE.tryCatch(
		(): Promise<unknown> => browser.storage.sync.get(),
		constant(error('Failed to get settings')),
	),
	T.map(E.chain(decode(settingsCodec))),
);

export const getActiveTheme: TaskEither<Error, Option<Theme>> = pipe(
	getSettings,
	T.map(E.map(flow(
		theme.get,
		O.chain(O.fromPredicate(isTheme)),
	))));

export const getBadgeDisplayOpt: TaskEither<Error, Option<BadgeDisplay>> = pipe(
	getSettings,
	T.map(E.map(flow(
		badgeDisplay.get,
		O.chain(O.fromPredicate(isBadgeDisplayOpt)),
	))));

