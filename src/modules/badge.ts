import { pipe } from 'fp-ts/lib/pipeable';
import { max } from 'fp-ts/lib/Ord';
import { flow, constant } from 'fp-ts/lib/function';
import * as T from 'fp-ts/lib/Task';
import * as TE from 'fp-ts/lib/TaskEither';
import * as TO from 'fp-ts-contrib/lib/TaskOption';
import * as E from 'fp-ts/lib/Either';
import * as O from 'fp-ts/lib/Option';
import * as A from 'fp-ts/lib/Array';
import * as EO from '~~/modules/eitherOption';
import { browser } from 'webextension-polyfill-ts';
import { getBadgeDisplayOpt, BadgeDisplay } from '~~/modules/settings';
import { fromString } from '~~/modules/url';
import { URLMatch, match, ordURLMatch } from '~~/modules/compare-urls';
import { getBookmarksFromLocalStorage, getActiveTab, onTabActivity } from '~~/modules/comms/browser';
import { snoc_ } from '~~/modules/array';
import { flip, _, runTask, runIO } from '~~/modules/fp';

const setBadge = (color: string) => (text: string): IO<void> => (): void => {
	browser.browserAction.setBadgeBackgroundColor({ color });
	browser.browserAction.setBadgeText({ text });
};

const disableBadge: IO<void> = () => {
	// Empty string disables the badge
	browser.browserAction.setBadgeText({ text: '' });
};


export const colors = {
	[URLMatch.Exact]: '#4286f4',
	[URLMatch.Domain]: '#a0c4ff',
};

const hrefToUrlReducer = (acc: Array<URL>, href: string): Array<URL> => pipe(
	fromString(href),
	E.fold(
		constant(acc),
		snoc_(acc),
	),
);

const getBookmarksUrlsFromLocalStorage: TaskEither<Error, Option<Array<URL>>> = pipe(
	getBookmarksFromLocalStorage,
	TE.map(O.map(flow(
		A.map(bm => bm.url),
		A.reduce([], hrefToUrlReducer),
	))),
);

let urlState: Array<URL> = [];

const syncBookmarks: Task<void> = async () => {
	const bookmarkUrls = await getBookmarksUrlsFromLocalStorage();

	if (EO.isRightSome(bookmarkUrls)) {
		urlState = bookmarkUrls.right.value;
	}
};

const reduceMatch = ([x, y]: [URLMatch, number]) => (z: URLMatch): [URLMatch, number] => [
	max(ordURLMatch)(x, z),
	z === URLMatch.None ? y : y + 1,
];

const checkUrl = (x: URL) => (ys: Array<URL>): [URLMatch, number] =>
	A.reduce<URL, [URLMatch, number]>([URLMatch.None, 0], (acc, y) =>
		reduceMatch(acc)(match(x)(y)))(ys);

const updateBadge = (badgeOpt: BadgeDisplay): Task<void> => async (): Promise<void> => {
	const urlRes = await pipe(
		getActiveTab,
		TO.chainOption(tab => O.fromNullable(tab.url)),
		TO.chainOption(flow(
			fromString,
			O.fromEither,
		)),
		TO.map(flip(checkUrl)(urlState)),
		runTask,
	);

	if (O.isSome(urlRes)) {
		const [result, numMatches] = urlRes.value;

		if (badgeOpt === BadgeDisplay.None || result === URLMatch.None) {
			disableBadge();
			return;
		}

		const text = badgeOpt === BadgeDisplay.WithCount
			? String(numMatches)
			: ' ';

		switch (result) {
			case URLMatch.Exact:
				runIO(setBadge(colors[URLMatch.Exact])(text));
				break;

			case URLMatch.Domain:
				runIO(setBadge(colors[URLMatch.Domain])(text));
				break;
		}
	}
};

/**
 * Initialise backend listener that automatically listens for changes to
 * bookmarks in LocalStorage and window tabs, and displays a badge if there is a
 * match. It runs and checks immediately after instantiation before listening
 * for further changes. All badge functionality is encapsulated within this
 * function's closure.
 */
export const initBadgeAndListen: Task<Task<void>> = () => {
	const getBadgeOptOrDefault: Task<BadgeDisplay> = pipe(
		getBadgeDisplayOpt,
		T.map(EO.getOrElse(constant<BadgeDisplay>(BadgeDisplay.WithCount))),
	);

	const update: Task<void> = async () => {
		// We don't want to sync bookmarks at all if badge option is set to none
		const badgeOpt = await runTask(getBadgeOptOrDefault);
		if (badgeOpt !== BadgeDisplay.None) await runTask(syncBookmarks);

		await runTask(updateBadge(badgeOpt));
	};

	// Update immediately on load
	runTask(update);

	// Update on tab activity
	onTabActivity(_(update));

	// Allow updates to be triggered by callback
	return Promise.resolve(update);
};

