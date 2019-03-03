import { Maybe } from 'purify-ts/Maybe';
import { browser } from 'webextension-polyfill-ts';
import { getBookmarks } from 'Modules/cache';
import { getActiveTab, onTabActivity, ActiveTabMatch } from 'Comms/shared';

export const colors = {
	[ActiveTabMatch.Exact]: '#4286f4',
	[ActiveTabMatch.Domain]: '#a0c4ff',
};

let urlState: URL[] = [];

const hrefToUrlReducer = (acc: URL[], href: string): URL[] =>
	Maybe
		// This can throw if the href passed as an argument is invalid
		.encase(() => new URL(href))
		.caseOf({
			Just: (url) => [...acc, url],
			Nothing: () => acc,
		});

export const fetchBookmarksAndUpdateBadge = async () => {
	const fetchedBookmarks = await getBookmarks().run();

	fetchedBookmarks
		.map(bms => bms
			.map(bm => bm.url)
			.reduce(hrefToUrlReducer, []),
		)
		.ifJust((bookmarks) => {
			urlState = bookmarks;

			updateBadge();
		});
};

const checkUrl = (url: URL) => {
	let result = ActiveTabMatch.None;

	for (const bookmarkUrl of urlState) {
		if (bookmarkUrl.href === url.href) {
			result = ActiveTabMatch.Exact;
			break;
		}

		if (bookmarkUrl.hostname === url.hostname) {
			result = ActiveTabMatch.Domain;
		}
	}

	return result;
}

const updateBadge = async () => {
	const activeTab = await getActiveTab().run();

	activeTab
		.chain(tab => Maybe.fromNullable(tab.url))
		.map(href => new URL(href))
		.map(checkUrl)
		.ifJust((result) => {
			switch (result) {
				case ActiveTabMatch.Exact:
					browser.browserAction.setBadgeBackgroundColor({ color: colors[ActiveTabMatch.Exact] });
					browser.browserAction.setBadgeText({ text: ' ' });
					break;
				case ActiveTabMatch.Domain:
					browser.browserAction.setBadgeBackgroundColor({ color: colors[ActiveTabMatch.Domain] });
					browser.browserAction.setBadgeText({ text: ' ' });
					break;
				case ActiveTabMatch.None:
					// Empty string disables the badge
					browser.browserAction.setBadgeText({ text: '' });
					break;
			}
		});
};

export const initBadgeAndWatch = () => {
	fetchBookmarksAndUpdateBadge();

	onTabActivity(updateBadge);
};
