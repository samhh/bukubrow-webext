import sortArrOfObjAlphabetically from 'Modules/sort-arr-of-obj-alphabetically';
import { BOOKMARKS_SCHEMA_VERSION } from 'Modules/config';

interface BookmarksRes {
	bookmarks?: LocalBookmark[];
	bookmarksSchemaVersion?: number;
}

// Fetch bookmarks from local storage, and check schema version
export const getBookmarks = () => new Promise<LocalBookmark[]>((resolve, reject) => {
	chrome.storage.local.get(['bookmarks', 'bookmarksSchemaVersion'], (data: BookmarksRes) => {
		if (
			data.bookmarksSchemaVersion !== BOOKMARKS_SCHEMA_VERSION ||
			!data.bookmarks || !data.bookmarks.length
		) {
			reject();

			return;
		}

		resolve(data.bookmarks);
	});
});

// Save bookmarks to local storage
export const saveBookmarks = (bookmarks: LocalBookmark[]) =>
	new Promise<void>((resolve) => {
		chrome.storage.local.set({
			bookmarks: sortArrOfObjAlphabetically(bookmarks, 'title'),
			bookmarksSchemaVersion: BOOKMARKS_SCHEMA_VERSION,
			hasTriggeredRequest: true,
		}, resolve);
	});

export const hasTriggeredRequest = () => new Promise<boolean>((resolve) => {
	chrome.storage.local.get('hasTriggeredRequest', (res) => {
		resolve(!!res.hasTriggeredRequest);
	});
});
