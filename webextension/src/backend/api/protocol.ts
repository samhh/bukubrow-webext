import { APP_NAME } from 'Modules/config';

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
export function sendNativeMessage<T extends NativeRequestMethod>(method: T, data: NativeRequestData[T]):
Promise<NativeRequestResult[T]> {
	return new Promise((resolve) => {
		chrome.runtime.sendNativeMessage(APP_NAME, { method, data }, resolve);
	});
}

export const sendExtensionMessage = (request: object) => new Promise((resolve) => {
	chrome.runtime.sendMessage(request);

	resolve();
});
