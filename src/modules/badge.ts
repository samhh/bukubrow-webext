import { Maybe } from 'purify-ts/Maybe';
import { browser } from 'webextension-polyfill-ts';
import { URLMatch } from 'Modules/compare-urls';
import { getBookmarksFromLocalStorage, getActiveTab, onTabActivity } from 'Comms/browser';

export const colors = {
	[URLMatch.Exact]: '#4286f4',
	[URLMatch.Domain]: '#a0c4ff',
};

let urlState: URL[] = [];

const hrefToUrlReducer = (acc: URL[], href: string): URL[] =>
	Maybe
		// This can throw if the href passed as an argument is invalid
		.encase(() => new URL(href))
		.caseOf({
			Just: url => [...acc, url],
			Nothing: () => acc,
		});

const getBookmarksUrlsFromLocalStorage = getBookmarksFromLocalStorage().map(bms => bms
	.map(bm => bm.url)
	.reduce(hrefToUrlReducer, []),
);

const syncBookmarks = async () => {
	const bookmarkUrls = await getBookmarksUrlsFromLocalStorage.run();

	bookmarkUrls.ifJust((urls) => {
		urlState = urls;
	});
};

const checkUrl = (url: URL) => {
	let bestMatch = URLMatch.None;
	let numMatches = 0;

	for (const bookmarkUrl of urlState) {
		if (bookmarkUrl.href === url.href) {
			bestMatch = URLMatch.Exact;
			numMatches++;
		}
		else if (bookmarkUrl.hostname === url.hostname) {
			if (bestMatch !== URLMatch.Exact) bestMatch = URLMatch.Domain;
			numMatches++;
		}
	}

	return [bestMatch, numMatches];
};

const updateBadge = async () => {
	const activeTab = await getActiveTab().run();

	activeTab
		.chain(tab => Maybe.fromNullable(tab.url))
		.map(href => new URL(href))
		.map(checkUrl)
		.ifJust(([result, numMatches]) => {
			switch (result) {
				case URLMatch.Exact:
					browser.browserAction.setBadgeBackgroundColor({ color: colors[URLMatch.Exact] });
					browser.browserAction.setBadgeText({ text: String(numMatches) });
					break;

				case URLMatch.Domain:
					browser.browserAction.setBadgeBackgroundColor({ color: colors[URLMatch.Domain] });
					browser.browserAction.setBadgeText({ text: String(numMatches) });
					break;

				case URLMatch.None:
					// Empty string disables the badge
					browser.browserAction.setBadgeText({ text: '' });
					break;
			}
		});
};

/**
 * Initialise backend listener that automatically listens for changes to
 * bookmarks in LocalStorage and window tabs, and displays a badge if there is a
 * match. It runs and checks immediately after instantiation before listening
 * for further changes. All badge functionality is encapsulated within this
 * function's closure.
 */
export const initBadgeAndListen = async () => {
	await syncBookmarks();
	updateBadge();

	onTabActivity(updateBadge);

	return async () => {
		await syncBookmarks();
		updateBadge();
	};
};
