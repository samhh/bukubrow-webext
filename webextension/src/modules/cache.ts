import { browser } from 'webextension-polyfill-ts';
import { NonEmptyList } from 'purify-ts/NonEmptyList';
import { Maybe } from 'purify-ts/Maybe';
import { MaybeAsync } from 'purify-ts/MaybeAsync';
import { BOOKMARKS_SCHEMA_VERSION } from 'Modules/config';
import { sortBookmarks } from 'Modules/bookmarks';

export interface StorageState {
	bookmarks: LocalBookmark[];
	bookmarksSchemaVersion: number;
	hasTriggeredRequest: boolean;
}

// Fetch bookmarks from local storage, and check schema version
export const getBookmarks = () => MaybeAsync(({ liftMaybe }) => browser.storage.local.get(['bookmarks', 'bookmarksSchemaVersion'])
	.then((data: Partial<Pick<StorageState, 'bookmarks' | 'bookmarksSchemaVersion'>>) => {
		// Once upon a time we tried to store tags as a Set. Chrome's extension
		// storage implementation didn't like this, but Firefox did. The change was
		// reverted, but now the tags are sometimes still stored as a set. For some
		// reason. This addresses that by ensuring any tags pulled from storage will
		// be resolved as an array, regardless of whether they're stored as an array
		// or a Set.
		return liftMaybe(Maybe
			.fromFalsy(data.bookmarksSchemaVersion === BOOKMARKS_SCHEMA_VERSION)
			.chain(() => Maybe.fromNullable(data.bookmarks))
			.chain(NonEmptyList.fromArray)
			.map(bookmarks => bookmarks.map((bm): LocalBookmark => ({
				...bm,
				tags: Array.from(bm.tags),
			}))));
	}));

// Save bookmarks to local storage
export const saveBookmarks = (bookmarks: LocalBookmark[]) => browser.storage.local.set({
	bookmarks: [...bookmarks].sort(sortBookmarks),
	bookmarksSchemaVersion: BOOKMARKS_SCHEMA_VERSION,
	hasTriggeredRequest: true,
});

export const hasTriggeredRequest = () => browser.storage.local.get('hasTriggeredRequest')
	.then((res: Partial<Pick<StorageState, 'hasTriggeredRequest'>>) => !!res.hasTriggeredRequest);
