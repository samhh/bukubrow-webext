import { browser, Tabs } from 'webextension-polyfill-ts';
import { Option, fromNullable, fromPredicate, fold, map, chain, getOrElse } from 'fp-ts/lib/Option';
import { pipe } from 'fp-ts/lib/pipeable';
import { Task } from 'fp-ts/lib/Task';
import { NonEmptyArray, fromArray } from 'fp-ts/lib/NonEmptyArray';
import { lookup } from 'fp-ts/lib/Array';
import { BOOKMARKS_SCHEMA_VERSION } from 'Modules/config';
import { sendIsomorphicMessage, IsomorphicMessage } from 'Comms/isomorphic';
import uuid from 'Modules/uuid';

export const getActiveTab: Task<Option<Tabs.Tab>> = () => browser.tabs.query({ active: true, currentWindow: true })
	.then(tabs => lookup(0, tabs));

export const getActiveWindowTabs: Task<Option<NonEmptyArray<Tabs.Tab>>> = () => browser.tabs.query({ currentWindow: true })
	.then(tabs => fromArray(tabs));

export const getAllTabs: Task<Option<NonEmptyArray<Tabs.Tab>>> = () => browser.tabs.query({})
	.then(tabs => fromArray(tabs));

export const onTabActivity = (cb: () => void) => {
	browser.tabs.onActivated.addListener(cb);
	browser.tabs.onUpdated.addListener(cb);
};

// The imperfect title includes check is because Firefox's href changes
// according to the extension in use, if any
const isNewTabPage = ({ url = '', title = '' }: Pick<Tabs.Tab, 'url' | 'title'>) =>
	['about:blank', 'chrome://newtab/'].includes(url) || title.includes('New Tab');

/// The active tab will not update quickly enough to allow this function to be
/// called safely in a loop. Therefore, the second argument forces consumers to
/// verify that this is only the first tab they're opening.
export const openBookmarkInAppropriateTab = async (url: string, isFirstTabToOpen: boolean) => {
	const canOpenInCurrentTab = await getActiveTab().then(fold(() => false, isNewTabPage));

	// Updates active window active tab if no ID specified
	if (canOpenInCurrentTab && isFirstTabToOpen) await browser.tabs.update(undefined, { url });
	else await browser.tabs.create({ url });
};

export interface StorageState {
	bookmarks: LocalBookmark[];
	stagedBookmarksGroups: StagedBookmarksGroup[];
	bookmarksSchemaVersion: number;
}

const getLocalStorage = <T extends keyof StorageState>(keys: T | T[]) =>
	browser.storage.local.get(keys) as Promise<Partial<Pick<StorageState, T>>>;

const setLocalStorage = (obj: Partial<StorageState>) => browser.storage.local.set(obj);

export const getBookmarksFromLocalStorage = () => getLocalStorage(['bookmarks', 'bookmarksSchemaVersion'])
	// Once upon a time we tried to store tags as a Set. Chrome's extension
	// storage implementation didn't like this, but Firefox did. The change was
	// reverted, but now the tags are sometimes still stored as a set. For some
	// reason. This addresses that by ensuring any tags pulled from storage will
	// be resolved as an array, regardless of whether they're stored as an array
	// or a Set.
	.then(data => pipe(
		data,
		fromPredicate(d => d.bookmarksSchemaVersion === BOOKMARKS_SCHEMA_VERSION),
		chain(d => fromNullable(d.bookmarks)),
		chain(fromArray),
		map(bms => bms.map((bm): LocalBookmark => ({
			...bm,
			tags: Array.from(bm.tags),
		}))),
	));

export const saveBookmarksToLocalStorage = async (bookmarks: LocalBookmark[]) => {
	await setLocalStorage({
		bookmarks,
		bookmarksSchemaVersion: BOOKMARKS_SCHEMA_VERSION,
	});

	sendIsomorphicMessage(IsomorphicMessage.BookmarksUpdatedInLocalStorage);
};

export const getStagedBookmarksGroupsFromLocalStorage: Task<Option<StagedBookmarksGroup[]>> = () => getLocalStorage('stagedBookmarksGroups')
	.then(({ stagedBookmarksGroups }) => fromNullable(stagedBookmarksGroups));

export const saveStagedBookmarksGroupsToLocalStorage = (stagedBookmarksGroups: StagedBookmarksGroup[]) =>
	setLocalStorage({ stagedBookmarksGroups });

export const saveStagedBookmarksAsNewGroupToLocalStorage = async (newStagedBookmarks: NonEmptyArray<LocalBookmarkUnsaved>) => {
	const stagedBookmarksGroups = await getStagedBookmarksGroupsFromLocalStorage()
		.then(getOrElse(() => [] as StagedBookmarksGroup[]));

	const groupIds = stagedBookmarksGroups.map(group => group.id);
	const newGroupId = uuid(groupIds);

	const newGroup: StagedBookmarksGroup = {
		id: newGroupId,
		time: new Date().getTime(),
		// Assign each bookmark a generated ID, and ensure they don't clash with
		// one another
		bookmarks: newStagedBookmarks.reduce<LocalBookmark[]>((acc, bm) => [...acc, {
			...bm,
			id: uuid(acc.map(b => b.id)),
		}], []),
	};

	await setLocalStorage({ stagedBookmarksGroups: [...stagedBookmarksGroups, newGroup] });
};
