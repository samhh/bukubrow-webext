import { browser } from 'webextension-polyfill-ts';
import { Either } from 'purify-ts/Either';
import { List } from 'purify-ts/List';
import { MaybeAsync } from 'purify-ts/MaybeAsync';

export enum ActiveTabMatch {
	Exact,
	Domain,
	None,
}

interface CheckBinaryReq {
	checkBinary: true;
}

interface GetBookmarksReq {
	requestBookmarks: true;
}

interface SaveBookmarkReq {
	saveBookmark: true;
	bookmark: LocalBookmarkUnsaved;
}

interface UpdateBookmarkReq {
	updateBookmark: true;
	bookmark: LocalBookmark;
}

interface DeleteBookmarkReq {
	deleteBookmark: true;
	bookmarkId: RemoteBookmark['id'];
}

export type BackendRequest =
	CheckBinaryReq | GetBookmarksReq | SaveBookmarkReq | UpdateBookmarkReq | DeleteBookmarkReq;

type CheckBinaryRes =
	| { outdatedBinary: true }
	| { cannotFindBinary: true }
	| { unknownError: true };

interface GetBookmarksRes {
	bookmarksUpdated: true;
}

interface SaveBookmarkRes {
	bookmarkSaved: true;
}

interface UpdateBookmarkRes {
	bookmarkUpdated: true;
}

interface DeleteBookmarkRes {
	bookmarkDeleted: true;
}

export type BackendResponse =
	CheckBinaryRes | GetBookmarksRes | SaveBookmarkRes | UpdateBookmarkRes | DeleteBookmarkRes;

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

export const mapURLToActiveTabMatch = (activeTabURL: URL) => (url: URL) => {
	if (url.href === activeTabURL.href) return ActiveTabMatch.Exact;
	if (url.hostname === activeTabURL.hostname) return ActiveTabMatch.Domain;
	return ActiveTabMatch.None;
};
