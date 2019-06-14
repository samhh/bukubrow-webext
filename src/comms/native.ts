import { browser } from 'webextension-polyfill-ts';
import { EitherAsync } from 'purify-ts/EitherAsync';
import { APP_NAME, MINIMUM_BINARY_VERSION } from 'Modules/config';
import { compareAgainstMinimum } from 'Modules/semantic-versioning';

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

export type NativeResponse =
	CheckBinaryRes | GetBookmarksRes | SaveBookmarkRes | UpdateBookmarkRes | DeleteBookmarkRes;

export enum NativeRequestMethod {
	GET = 'GET',
	OPTIONS = 'OPTIONS',
	POST = 'POST',
	PUT = 'PUT',
	DELETE = 'DELETE',
}

interface ErrResponse {
	success: false;
	message: string;
}

type NativeGETResponse = {
	success: true;
	bookmarks: RemoteBookmark[];
	moreAvailable: boolean;
} | ErrResponse;

interface NativeOPTIONSResponse {
	success: true;
	binaryVersion: string;
}

type NativePOSTResponse = { success: true; id: number } | { success: false };

interface NativePUTResponse {
	success: boolean;
}

interface NativeDELETEResponse {
	success: boolean;
}

export interface NativeRequestData {
	GET: { offset: number } | undefined;
	OPTIONS: undefined;
	POST: { bookmarks: RemoteBookmarkUnsaved[] };
	PUT: { bookmarks: RemoteBookmark[] };
	DELETE: { bookmark_ids: RemoteBookmark['id'][] };
}

export interface NativeRequestResult {
	GET: NativeGETResponse;
	OPTIONS: NativeOPTIONSResponse;
	POST: NativePOSTResponse;
	PUT: NativePUTResponse;
	DELETE: NativeDELETEResponse;
}

const sendMessageToNative = <T extends NativeRequestMethod>(method: T, data: NativeRequestData[T]) =>
	browser.runtime.sendNativeMessage(APP_NAME, { method, data }) as Promise<NativeRequestResult[T]>;

export class OutdatedVersionError extends Error {}

// Ensure binary version is equal to or newer than what we're expecting, but on
// the same major version (semantic versioning)
export const checkBinaryVersionFromNative = () => EitherAsync<Error | OutdatedVersionError, void>(() =>
	sendMessageToNative(NativeRequestMethod.OPTIONS, undefined)
		.then((res) => {
			const valid = !!(
				res &&
				res.success &&
				res.binaryVersion &&
				compareAgainstMinimum(MINIMUM_BINARY_VERSION, res.binaryVersion)
			);

			if (!valid) throw new OutdatedVersionError();
		}));

export const getBookmarksFromNative = () => {
	const get = async (prevBookmarks: RemoteBookmark[] = []): Promise<NativeGETResponse> => {
		const res = await sendMessageToNative(NativeRequestMethod.GET, { offset: prevBookmarks.length });

		if (!res.success) return res;

		const bookmarks = [...prevBookmarks, ...res.bookmarks];
		return res.moreAvailable
			? get(bookmarks)
			: { ...res, bookmarks };
	};

	return get();
};

export const saveBookmarksToNative = (bookmarks: RemoteBookmarkUnsaved[]) =>
	sendMessageToNative(NativeRequestMethod.POST, { bookmarks });

export const updateBookmarksToNative = (bookmarks: RemoteBookmark[]) =>
	sendMessageToNative(NativeRequestMethod.PUT, { bookmarks });

export const deleteBookmarksFromNative = (bookmarkIds: RemoteBookmark['id'][]) =>
	// eslint-disable-next-line @typescript-eslint/camelcase
	sendMessageToNative(NativeRequestMethod.DELETE, { bookmark_ids: bookmarkIds });

