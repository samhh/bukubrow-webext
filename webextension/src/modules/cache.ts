import sortArrOfObjAlphabetically from 'Modules/sort-arr-of-obj-alphabetically';
import { BOOKMARKS_SCHEMA_VERSION } from 'Modules/config';

interface BookmarksRes {
	bookmarks?: LocalBookmark[];
	bookmarksSchemaVersion?: number;
}

// Fetch bookmarks from local storage, and check schema version
export const getBookmarks = (): Promise<LocalBookmark[]> => new Promise((resolve, reject) => {
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
export const saveBookmarks = (bookmarks: LocalBookmark[]): Promise<void> =>
	new Promise((resolve, reject) => {
		chrome.storage.local.set({
			bookmarks: sortArrOfObjAlphabetically(bookmarks, 'title'),
			bookmarksSchemaVersion: BOOKMARKS_SCHEMA_VERSION,
			hasTriggeredRequest: true,
		}, resolve);
	});
