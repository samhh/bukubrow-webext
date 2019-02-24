import { browser } from 'webextension-polyfill-ts';
import { NonEmptyList } from 'purify-ts/NonEmptyList';
import { sortByObjectStringValue } from 'Modules/array';
import { BOOKMARKS_SCHEMA_VERSION } from 'Modules/config';
import { Maybe } from 'purify-ts/Maybe';

export interface StorageState {
	bookmarks: LocalBookmark[];
	bookmarksSchemaVersion: number;
	hasTriggeredRequest: boolean;
}

// Fetch bookmarks from local storage, and check schema version
export const getBookmarks = () => browser.storage.local.get(['bookmarks', 'bookmarksSchemaVersion'])
	.then((data: Partial<Pick<StorageState, 'bookmarks' | 'bookmarksSchemaVersion'>>) => {
		// Once upon a time we tried to store tags as a Set. Chrome's extension
		// storage implementation didn't like this, but Firefox did. The change was
		// reverted, but now the tags are sometimes still stored as a set. For some
		// reason. This addresses that by ensuring any tags pulled from storage will
		// be resolved as an array, regardless of whether they're stored as an array
		// or a Set.
		return Maybe.fromFalsy(data.bookmarksSchemaVersion === BOOKMARKS_SCHEMA_VERSION)
			.map(() => Maybe.fromNullable(data.bookmarks).orDefault([]))
			.chain(NonEmptyList.fromArray)
			.map(bookmarks => bookmarks.map((bm): LocalBookmark => ({
				...bm,
				tags: Array.from(bm.tags),
			})));
	});

// Save bookmarks to local storage
export const saveBookmarks = (bookmarks: LocalBookmark[]) => browser.storage.local.set({
	bookmarks: sortByObjectStringValue(bookmarks, 'title'),
	bookmarksSchemaVersion: BOOKMARKS_SCHEMA_VERSION,
	hasTriggeredRequest: true,
});

export const hasTriggeredRequest = () => browser.storage.local.get('hasTriggeredRequest')
	.then((res: Partial<Pick<StorageState, 'hasTriggeredRequest'>>) => !!res.hasTriggeredRequest);
