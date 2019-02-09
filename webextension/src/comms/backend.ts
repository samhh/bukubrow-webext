import { browser } from 'webextension-polyfill-ts';
import { APP_NAME, MINIMUM_BINARY_VERSION } from 'Modules/config';
import { compareAgainstMinimum } from 'Modules/semantic-versioning';
import { BackendResponse } from './shared';

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
} | ErrResponse;

interface NativeOPTIONSResponse {
	success: true;
	binaryVersion: string;
}

type NativePOSTResponse = { success: true; id: number; } | { success: false };

interface NativePUTResponse {
	success: boolean;
}

interface NativeDELETEResponse {
	success: boolean;
}

type NativeRequestData = {
	GET: undefined;
	OPTIONS: undefined;
	POST: { bookmark: RemoteBookmarkUnsaved };
	PUT: { bookmark: RemoteBookmark };
	DELETE: { bookmark_id: RemoteBookmark['id'] };
};

type NativeRequestResult = {
	GET: NativeGETResponse;
	OPTIONS: NativeOPTIONSResponse;
	POST: NativePOSTResponse;
	PUT: NativePUTResponse;
	DELETE: NativeDELETEResponse;
};

const sendNativeMessage = <T extends NativeRequestMethod>(method: T, data: NativeRequestData[T]) =>
	browser.runtime.sendNativeMessage(APP_NAME, { method, data }) as Promise<NativeRequestResult[T]>;

// Ensure binary version is equal to or newer than what we're expecting, but on
// the same major version (semantic versioning)
export const checkBinaryVersion = () =>
	sendNativeMessage(NativeRequestMethod.OPTIONS, undefined).then(res => (
		res &&
		res.success &&
		res.binaryVersion &&
		compareAgainstMinimum(MINIMUM_BINARY_VERSION, res.binaryVersion)
	) || false);

export const getBookmarks = () =>
	sendNativeMessage(NativeRequestMethod.GET, undefined);

export const saveBookmark = (bookmark: RemoteBookmarkUnsaved) =>
	sendNativeMessage(NativeRequestMethod.POST, { bookmark });

export const updateBookmark = (bookmark: RemoteBookmark) =>
	sendNativeMessage(NativeRequestMethod.PUT, { bookmark });

export const deleteBookmark = (bookmarkId: RemoteBookmark['id']) =>
	sendNativeMessage(NativeRequestMethod.DELETE, { bookmark_id: bookmarkId });

export const sendFrontendMessage = (response: BackendResponse): Promise<void> =>
	browser.runtime.sendMessage(response);
