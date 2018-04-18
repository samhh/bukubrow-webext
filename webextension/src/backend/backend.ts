import { transform, untransform } from 'Modules/schema-transform';
import { checkRuntimeErrors, BackendRequest } from 'Comms/shared';
import { saveBookmarks as saveBookmarksToLocalStorage } from 'Modules/cache';
import {
	sendFrontendMessage,
	checkBinaryVersion,
	getBookmarks as getBookmarksFromDb,
	saveBookmark as saveBookmarkToDb,
	updateBookmark as updateBookmarkInDb,
} from 'Comms/backend';

const checkBinary = (): Promise<boolean> => {
	const errors = checkRuntimeErrors();
	const version = checkBinaryVersion();

	return Promise.all([errors, version])
		.then(([err, versionIsOkay]) => {
			if (err) {
				err === 'Specified native messaging host not found.'
					? sendFrontendMessage({ cannotFindBinary: true })
					: sendFrontendMessage({ unknownError: true });

				return false;
			}

			if (!versionIsOkay) {
				sendFrontendMessage({ outdatedBinary: true });

				return false;
			}

			return true;
		});
};

const requestBookmarks = (): Promise<boolean> =>
	getBookmarksFromDb()
		.then((res) => {
			if (!res || !res.success || !res.bookmarks) return false;

			const bookmarks = res.bookmarks.map(transform);

			return saveBookmarksToLocalStorage(bookmarks).then(() => {
				sendFrontendMessage({ bookmarksUpdated: true });

				return true;
			});
		});

const saveBookmark = (bookmark: LocalBookmarkUnsaved): Promise<boolean> =>
	saveBookmarkToDb(untransform(bookmark))
		.then((res) => {
			if (!res || !res.success) return false;

			sendFrontendMessage({ bookmarkSaved: true });

			return true;
		});

const updateBookmark = (bookmark: LocalBookmark): Promise<boolean> =>
	updateBookmarkInDb(untransform(bookmark))
		.then((res) => {
			if (!res || !res.success) return false;

			sendFrontendMessage({ bookmarkUpdated: true });

			return true;
		});

// Listen for messages from frontend
chrome.runtime.onMessage.addListener((req: BackendRequest): void => {
	if ('checkBinary' in req) checkBinary();
	if ('requestBookmarks' in req) requestBookmarks();
	if ('saveBookmark' in req) saveBookmark(req.bookmark);
	if ('updateBookmark' in req) updateBookmark(req.bookmark);
});
