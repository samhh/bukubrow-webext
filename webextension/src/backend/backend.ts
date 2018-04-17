import { transform, untransform } from 'Modules/schema-transform';
import { sendExtensionMessage } from './api/protocol';
import { saveBookmarks as saveBookmarksToLocalStorage } from './local-storage';
import {
	checkRuntimeErrors,
	checkBinaryVersion,
	getBookmarks as getBookmarksFromDb,
	saveBookmark as saveBookmarkToDb,
	updateBookmark as updateBookmarkInDb,
} from './api/native';

const checkBinary = (): Promise<boolean> => {
	const errors = checkRuntimeErrors();
	const version = checkBinaryVersion();

	return Promise.all([errors, version])
		.then(([err, versionIsOkay]) => {
			if (err) {
				err === 'Specified native messaging host not found.'
					? sendExtensionMessage({ cannotFindBinary: true })
					: sendExtensionMessage({ unknownError: true });

				return false;
			}

			if (!versionIsOkay) {
				sendExtensionMessage({ outdatedBinary: true });

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
				sendExtensionMessage({ bookmarksUpdated: true });

				return true;
			});
		});

const saveBookmark = (bookmark: LocalBookmarkUnsaved): Promise<boolean> =>
	saveBookmarkToDb(untransform(bookmark))
		.then((res) => {
			if (!res || !res.success) return false;

			sendExtensionMessage({ bookmarkSaved: true });

			return true;
		});

const updateBookmark = (bookmark: LocalBookmark): Promise<boolean> =>
	updateBookmarkInDb(untransform(bookmark))
		.then((res) => {
			if (!res || !res.success) return false;

			sendExtensionMessage({ bookmarkUpdated: true });

			return true;
		});

// Listen for messages from frontend
chrome.runtime.onMessage.addListener((req): void => {
	if (req.checkBinary) checkBinary();
	if (req.requestBookmarks) requestBookmarks();
	if (req.saveBookmark && req.bookmark) saveBookmark(req.bookmark);
	if (req.updateBookmark && req.bookmark) updateBookmark(req.bookmark);
});
