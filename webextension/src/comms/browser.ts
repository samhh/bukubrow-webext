import { browser } from 'webextension-polyfill-ts';
import { Maybe } from 'purify-ts/Maybe';
import { Either } from 'purify-ts/Either';
import { List } from 'purify-ts/List';
import { NonEmptyList } from 'purify-ts/NonEmptyList';
import { MaybeAsync } from 'purify-ts/MaybeAsync';
import { BOOKMARKS_SCHEMA_VERSION } from 'Modules/config';
import { sendIsomorphicMessage, IsomorphicMessage } from 'Comms/isomorphic';
import uuid from 'Modules/uuid';

export const checkRuntimeErrors = () => Either.encase(() => {
	const errMsg = browser.runtime.lastError && browser.runtime.lastError.message;

	if (errMsg) throw new Error(errMsg);
});

export const getActiveTab = () => MaybeAsync(({ liftMaybe }) => browser.tabs.query({ active: true, currentWindow: true })
	.then(tabs => liftMaybe(List.at(0, tabs))));

export const getActiveWindowTabs = () => MaybeAsync(({ liftMaybe }) => browser.tabs.query({ currentWindow: true })
	.then(tabs => liftMaybe(NonEmptyList.fromArray(tabs))));

export const getAllTabs = () => MaybeAsync(({ liftMaybe }) => browser.tabs.query({})
	.then(tabs => liftMaybe(NonEmptyList.fromArray(tabs))));

export const onTabActivity = (cb: () => void) => {
	browser.tabs.onActivated.addListener(cb);
	browser.tabs.onUpdated.addListener(cb);
};

export interface StorageState {
	bookmarks: LocalBookmark[];
	stagedBookmarksGroups: StagedBookmarksGroup[];
	bookmarksSchemaVersion: number;
	hasTriggeredRequest: boolean;
}

const getLocalStorage = <T extends keyof StorageState>(keys: T | T[]) =>
	browser.storage.local.get(keys) as Promise<Partial<Pick<StorageState, T>>>;

const setLocalStorage = (obj: Partial<StorageState>) => browser.storage.local.set(obj);

export const getBookmarksFromLocalStorage = () => MaybeAsync(({ liftMaybe }) => getLocalStorage(['bookmarks', 'bookmarksSchemaVersion'])
	.then((data) => {
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

export const saveBookmarksToLocalStorage = async (bookmarks: LocalBookmark[]) => {
	await setLocalStorage({
		bookmarks,
		bookmarksSchemaVersion: BOOKMARKS_SCHEMA_VERSION,
		hasTriggeredRequest: true,
	});

	sendIsomorphicMessage(IsomorphicMessage.BookmarksUpdatedInLocalStorage);
};

export const getStagedBookmarksGroupsFromLocalStorage = () => MaybeAsync(({ liftMaybe }) => getLocalStorage('stagedBookmarksGroups')
	.then(({ stagedBookmarksGroups }) => liftMaybe(Maybe.fromNullable(stagedBookmarksGroups))));

export const saveStagedBookmarksAsNewGroupToLocalStorage = async (newStagedBookmarks: NonEmptyList<LocalBookmarkUnsaved>) => {
	const stagedBookmarksGroupsRes = await getStagedBookmarksGroupsFromLocalStorage().run();
	const stagedBookmarksGroups = stagedBookmarksGroupsRes.orDefault([]);

	const groupIds = stagedBookmarksGroups.map(group => group.id);
	const newGroupId = uuid(groupIds);

	const newGroup: StagedBookmarksGroup = {
		id: newGroupId,
		bookmarks: newStagedBookmarks,
	};

	setLocalStorage({ stagedBookmarksGroups: [...stagedBookmarksGroups, newGroup] });
}

export const hasTriggeredRequest = () => getLocalStorage('hasTriggeredRequest')
	.then((res) => !!res.hasTriggeredRequest);
