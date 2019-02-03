import { browser } from 'webextension-polyfill-ts';
import { transform, untransform } from 'Modules/schema-transform';
import { checkRuntimeErrors, BackendRequest } from 'Comms/shared';
import { saveBookmarks as saveBookmarksToLocalStorage } from 'Modules/cache';
import {
	sendFrontendMessage,
	checkBinaryVersion,
	getBookmarks as getBookmarksFromDb,
	saveBookmark as saveBookmarkToDb,
	updateBookmark as updateBookmarkInDb,
	deleteBookmark as deleteBookmarkFromDb,
} from 'Comms/backend';

const checkBinary = () => {
	const errors = checkRuntimeErrors();
	const version = checkBinaryVersion();

	return Promise.all([errors, version])
		.then(([errm, versionIsOkay]) => {
			errm
				.ifJust((err) => {
					if (err === 'Specified native messaging host not found.') sendFrontendMessage({ cannotFindBinary: true });
					else sendFrontendMessage({ unknownError: true });
				})
				.ifNothing(() => {
					if (!versionIsOkay) sendFrontendMessage({ outdatedBinary: true });
				});

			return errm.isNothing() && versionIsOkay;
		});
};

const requestBookmarks = () => getBookmarksFromDb().then((res) => {
	if (!res || !res.success || !res.bookmarks) return false;

	const bookmarks = res.bookmarks.map(transform);

	return saveBookmarksToLocalStorage(bookmarks).then(() => {
		sendFrontendMessage({ bookmarksUpdated: true });

		return true;
	});
});

const saveBookmark = (bookmark: LocalBookmarkUnsaved) => saveBookmarkToDb(untransform(bookmark)).then((res) => {
	if (!res || !res.success) return false;

	sendFrontendMessage({ bookmarkSaved: true });

	return true;
});

const updateBookmark = (bookmark: LocalBookmark) => updateBookmarkInDb(untransform(bookmark)).then((res) => {
	if (!res || !res.success) return false;

	sendFrontendMessage({ bookmarkUpdated: true });

	return true;
});

const deleteBookmark = (bookmarkId: number) => deleteBookmarkFromDb(bookmarkId).then((res) => {
	if (!res || !res.success) return false;

	sendFrontendMessage({ bookmarkDeleted: true });

	return true;
});

// Listen for messages from frontend
browser.runtime.onMessage.addListener((req: BackendRequest) => {
	if ('checkBinary' in req) checkBinary();
	if ('requestBookmarks' in req) requestBookmarks();
	if ('saveBookmark' in req) saveBookmark(req.bookmark);
	if ('updateBookmark' in req) updateBookmark(req.bookmark);
	if ('deleteBookmark' in req) deleteBookmark(req.bookmarkId);
});
