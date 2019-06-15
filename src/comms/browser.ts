import { browser } from 'webextension-polyfill-ts';
import { Maybe } from 'purify-ts/Maybe';
import { List } from 'purify-ts/List';
import { NonEmptyList } from 'purify-ts/NonEmptyList';
import { MaybeAsync } from 'purify-ts/MaybeAsync';
import { BOOKMARKS_SCHEMA_VERSION } from 'Modules/config';
import { sendIsomorphicMessage, IsomorphicMessage } from 'Comms/isomorphic';
import uuid from 'Modules/uuid';

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

// The imperfect title includes check is because Firefox's href changes
// according to the extension in use, if any
const isNewTabPage = (href: string, title: string) =>
	['about:blank', 'chrome://newtab/'].includes(href) || title.includes('New Tab');

/// The active tab will not update quickly enough to allow this function to be
/// called safely in a loop. Therefore, the second argument forces consumers to
/// verify that this is only the first tab they're opening.
export const openBookmarkInAppropriateTab = async (url: string, isFirstTabToOpen: boolean) => {
	const canOpenInCurrentTab = await getActiveTab().run().then(res =>
		res.mapOrDefault(tab => isNewTabPage(tab.url || '', tab.title || ''), false));

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
	});

	sendIsomorphicMessage(IsomorphicMessage.BookmarksUpdatedInLocalStorage);
};

export const getStagedBookmarksGroupsFromLocalStorage = () => MaybeAsync(({ liftMaybe }) => getLocalStorage('stagedBookmarksGroups')
	.then(({ stagedBookmarksGroups }) => liftMaybe(Maybe.fromNullable(stagedBookmarksGroups))));

export const saveStagedBookmarksGroupsToLocalStorage = (stagedBookmarksGroups: StagedBookmarksGroup[]) =>
	setLocalStorage({ stagedBookmarksGroups });

export const saveStagedBookmarksAsNewGroupToLocalStorage = async (newStagedBookmarks: NonEmptyList<LocalBookmarkUnsaved>) => {
	const stagedBookmarksGroupsRes = await getStagedBookmarksGroupsFromLocalStorage().run();
	const stagedBookmarksGroups = stagedBookmarksGroupsRes.orDefault([]);

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
