import { browser } from 'webextension-polyfill-ts';
import sortArrOfObjAlphabetically from 'Modules/sort-arr-of-obj-alphabetically';
import { BOOKMARKS_SCHEMA_VERSION } from 'Modules/config';

interface StorageState {
	bookmarks?: LocalBookmark[];
	bookmarksSchemaVersion?: number;
	hasTriggeredRequest?: boolean;
}

// Fetch bookmarks from local storage, and check schema version
export const getBookmarks = () => browser.storage.local.get(['bookmarks', 'bookmarksSchemaVersion'])
	.then((data: Pick<StorageState, 'bookmarks' | 'bookmarksSchemaVersion'>) => {
		if (data.bookmarksSchemaVersion !== BOOKMARKS_SCHEMA_VERSION || !data.bookmarks || !data.bookmarks.length) {
			return [] as LocalBookmark[];
		}

		// Once upon a time we tried to store tags as a Set. Chrome's extension
		// storage implementation didn't like this, but Firefox did. The change was
		// reverted, but now the tags are sometimes still stored as a set. For some
		// reason. This addresses that by ensuring any tags pulled from storage will
		// be resolved as an array, regardless of whether they're stored as an array
		// or a Set.
		return data.bookmarks.map(bm => ({
			...bm,
			tags: Array.from(bm.tags),
		} as LocalBookmark));
	});

// Save bookmarks to local storage
export const saveBookmarks = (bookmarks: LocalBookmark[]) => browser.storage.local.set({
	bookmarks: sortArrOfObjAlphabetically(bookmarks, 'title'),
	bookmarksSchemaVersion: BOOKMARKS_SCHEMA_VERSION,
	hasTriggeredRequest: true,
});

export const hasTriggeredRequest = () => browser.storage.local.get('hasTriggeredRequest')
	.then((res: Pick<StorageState, 'hasTriggeredRequest'>) => !!res.hasTriggeredRequest);
