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

export type BackendRequest =
	CheckBinaryReq | GetBookmarksReq | SaveBookmarkReq | UpdateBookmarkReq;

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

export type BackendResponse =
	CheckBinaryRes | GetBookmarksRes | SaveBookmarkRes | UpdateBookmarkRes;

export const checkRuntimeErrors = () => new Promise((resolve) => {
	resolve((chrome.runtime.lastError && chrome.runtime.lastError.message) || false);
});
