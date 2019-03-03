import { Maybe } from 'purify-ts/Maybe';
import { browser } from 'webextension-polyfill-ts';
import { getBookmarks } from 'Modules/cache';
import { getActiveTab, onTabActivity } from 'Comms/shared';

enum Match {
	Exact,
	Domain,
	None,
}

const colors = {
	[Match.Exact]: '#4286f4',
	[Match.Domain]: '#a0c4ff',
};

let urlState: URL[] = [];

const hrefToUrlReducer = (acc: URL[], href: string): URL[] => {
	try {
		// This can throw if the string URL passed as an argument is invalid
		const url = new URL(href);

		return [...acc, url];
	} catch(_err) {
		return acc;
	}
}

export const fetchBookmarksAndUpdateBadge = async () => {
	const fetchedBookmarks = await getBookmarks();

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
	let result = Match.None;

	for (const bookmarkUrl of urlState) {
		if (bookmarkUrl.href === url.href) {
			result = Match.Exact;
			break;
		}

		if (bookmarkUrl.hostname === url.hostname) {
			result = Match.Domain;
		}
	}

	return result;
}

const updateBadge = async () => {
	const activeTab = await getActiveTab();

	activeTab
		.chain(tab => Maybe.fromNullable(tab.url))
		.map(href => new URL(href))
		.map(checkUrl)
		.ifJust((result) => {
			switch (result) {
				case Match.Exact:
				case Match.Domain:
					browser.browserAction.setBadgeBackgroundColor({ color: colors[result] });
					browser.browserAction.setBadgeText({ text: ' ' });
					break;
				case Match.None:
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
