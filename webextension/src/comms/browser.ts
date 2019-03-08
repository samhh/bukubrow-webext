import { browser } from 'webextension-polyfill-ts';
import { Maybe } from 'purify-ts/Maybe';
import { Either } from 'purify-ts/Either';
import { List } from 'purify-ts/List';
import { NonEmptyList } from 'purify-ts/NonEmptyList';
import { MaybeAsync } from 'purify-ts/MaybeAsync';
import { BOOKMARKS_SCHEMA_VERSION } from 'Modules/config';
import { sendIsomorphicMessage, IsomorphicMessage } from 'Comms/isomorphic';

export const checkRuntimeErrors = () => Either.encase(() => {
	const errMsg = browser.runtime.lastError && browser.runtime.lastError.message;

	if (errMsg) throw new Error(errMsg);
});

export const getActiveTab = () => MaybeAsync(({ liftMaybe }) => browser.tabs.query({ active: true, currentWindow: true })
	.then(tabs => liftMaybe(List.at(0, tabs))));

export const onTabActivity = (cb: () => void) => {
	browser.tabs.onActivated.addListener(cb);
	browser.tabs.onUpdated.addListener(cb);
};

export interface StorageState {
	bookmarks: LocalBookmark[];
	bookmarksSchemaVersion: number;
	hasTriggeredRequest: boolean;
}

// Fetch bookmarks from local storage, and check schema version
export const getBookmarksFromLocalStorage = () => MaybeAsync(({ liftMaybe }) => browser.storage.local.get(['bookmarks', 'bookmarksSchemaVersion'])
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
export const saveBookmarksToLocalStorage = async (bookmarks: LocalBookmark[]) => {
	await browser.storage.local.set({
		bookmarks,
		bookmarksSchemaVersion: BOOKMARKS_SCHEMA_VERSION,
		hasTriggeredRequest: true,
	});

	sendIsomorphicMessage(IsomorphicMessage.BookmarksUpdatedInLocalStorage);
};

export const hasTriggeredRequest = () => browser.storage.local.get('hasTriggeredRequest')
	.then((res: Partial<Pick<StorageState, 'hasTriggeredRequest'>>) => !!res.hasTriggeredRequest);
