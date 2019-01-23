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

		// Once upon a time we tried to store tags as a Set. Chrome's extension
		// storage implementation didn't like this, but Firefox did. The change was
		// reverted, but now the tags are sometimes still stored as a set. For some
		// reason. This addresses that by ensuring any tags pulled from storage will
		// be resolved as an array, regardless of whether they're stored as an array
		// or a Set.
		const normalisedBookmarks = data.bookmarks.map(bm => ({
			...bm,
			tags: Array.from(bm.tags),
		}));

		resolve(normalisedBookmarks);
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
