import { APP_NAME, MINIMUM_BINARY_VERSION } from 'Modules/config';
import { compareAgainstMinimum } from 'Modules/semantic-versioning';
import { BackendResponse } from './shared';

export enum NativeRequestMethod {
	GET = 'GET',
	OPTIONS = 'OPTIONS',
	POST = 'POST',
	PUT = 'PUT',
}

interface NativeGETResponse {
	success: boolean;
	message?: string;
	bookmarks?: RemoteBookmark[];
}

interface NativeOPTIONSResponse {
	success: boolean;
	binaryVersion: string;
}

interface NativePOSTResponse {
	success: boolean;
}

interface NativePUTResponse {
	success: boolean;
}

type NativeRequestData = {
	GET: undefined;
	OPTIONS: undefined;
	POST: RemoteBookmarkUnsaved;
	PUT: RemoteBookmarkUnsaved;
};

type NativeRequestResult = {
	GET: NativeGETResponse;
	OPTIONS: NativeOPTIONSResponse;
	POST: NativePOSTResponse;
	PUT: NativePUTResponse;
};

// tslint:disable-next-line max-line-length
function sendNativeMessage<T extends NativeRequestMethod>(method: T, data: NativeRequestData[T]):
Promise<NativeRequestResult[T]> {
	return new Promise((resolve) => {
		chrome.runtime.sendNativeMessage(APP_NAME, { method, data }, resolve);
	});
}

// Ensure binary version is equal to or newer than what we're expecting, but on
// the same major version (semantic versioning)
export const checkBinaryVersion = () =>
	sendNativeMessage(NativeRequestMethod.OPTIONS, undefined)
		.then(res => (
			res &&
			res.success &&
			res.binaryVersion &&
			compareAgainstMinimum(MINIMUM_BINARY_VERSION, res.binaryVersion)
		));

export const getBookmarks = () =>
	sendNativeMessage(NativeRequestMethod.GET, undefined);

export const saveBookmark = (bookmark: RemoteBookmarkUnsaved) =>
	sendNativeMessage(NativeRequestMethod.POST, bookmark);

export const updateBookmark = (bookmark: RemoteBookmarkUnsaved) =>
	sendNativeMessage(NativeRequestMethod.PUT, bookmark);

export const sendFrontendMessage = (response: BackendResponse) =>
	new Promise((resolve) => {
		chrome.runtime.sendMessage(response);

		resolve();
	});
