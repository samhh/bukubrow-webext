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
	{ outdatedBinary: true } |
	{ cannotFindBinary: true } |
	{ unknownError: true };

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

export const checkRuntimeErrors = () => new Promise((resolve) => {
	resolve((chrome.runtime.lastError && chrome.runtime.lastError.message) || false);
});
