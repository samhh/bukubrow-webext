import { browser } from 'webextension-polyfill-ts';
import { Maybe } from 'purify-ts/Maybe';
import { transform, untransform } from 'Modules/bookmarks';
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
import { initBadgeAndWatch, fetchBookmarksAndUpdateBadge } from 'Modules/badge';

initBadgeAndWatch();

class BackendErrorWithContext extends Error {
	public context: unknown | unknown[];

	public constructor(message: string, context: unknown | unknown[]) {
		super(message);

		this.context = context;
	}
}

const checkBinary = async () => {
	const errors = checkRuntimeErrors();
	const version = await checkBinaryVersion().run();

	errors.ifLeft((err) => {
		if (err.message.includes('host not found')) sendFrontendMessage({ cannotFindBinary: true });
		else sendFrontendMessage({ unknownError: true });
	});

	version.ifLeft(() => {
		sendFrontendMessage({ outdatedBinary: true });
	});

	if (errors.isLeft() || version.isLeft()) {
		throw new BackendErrorWithContext('Binary check failed', [errors.extract(), version.extract()]);
	}
};

const requestBookmarks = () => getBookmarksFromDb().then((res) => {
	return Maybe.fromNullable((res && res.success && res.bookmarks) || null)
		.map(bm => bm.map(transform))
		.caseOf({
			Just: bm => saveBookmarksToLocalStorage(bm).then(() => {
				sendFrontendMessage({ bookmarksUpdated: true });
				fetchBookmarksAndUpdateBadge();
			}),
			Nothing: () => { throw new BackendErrorWithContext('Failed to fetch bookmarks', res) },
		});
});

const saveBookmark = (bookmark: LocalBookmarkUnsaved) => saveBookmarkToDb(untransform(bookmark)).then((res) => {
	if (!res || !res.success) throw new BackendErrorWithContext('Failed to save bookmark', res);

	sendFrontendMessage({ bookmarkSaved: true });
});

const updateBookmark = (bookmark: LocalBookmark) => updateBookmarkInDb(untransform(bookmark)).then((res) => {
	if (!res || !res.success) throw new BackendErrorWithContext('Failed to update bookmark', res);

	sendFrontendMessage({ bookmarkUpdated: true });
});

const deleteBookmark = (bookmarkId: number) => deleteBookmarkFromDb(bookmarkId).then((res) => {
	if (!res || !res.success) throw new BackendErrorWithContext('Failed to delete bookmark', res);

	sendFrontendMessage({ bookmarkDeleted: true });
});

// Listen for messages from frontend
browser.runtime.onMessage.addListener((req: BackendRequest) => {
	try {
		if ('checkBinary' in req) checkBinary();
		if ('requestBookmarks' in req) requestBookmarks();
		if ('saveBookmark' in req) saveBookmark(req.bookmark);
		if ('updateBookmark' in req) updateBookmark(req.bookmark);
		if ('deleteBookmark' in req) deleteBookmark(req.bookmarkId);
	} catch (err) {
		// eslint-disable-next-line no-console
		console.error('Backend listener error: ', err, err instanceof BackendErrorWithContext ? err.context : null);
	}
});
