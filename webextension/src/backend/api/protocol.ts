import { APP_NAME } from 'Modules/config';

export enum NativeRequestMethod {
	GET = 'GET',
	OPTIONS = 'OPTIONS',
}

interface NativeGETResponse {
	success: boolean;
	bookmarks: RemoteBookmark[];
}

interface NativeOPTIONSResponse {
	success: boolean;
	binaryVersion: string;
}

type NativeRequestResult = {
	GET: NativeGETResponse,
	OPTIONS: NativeOPTIONSResponse,
};

export function sendNativeMessage<T extends NativeRequestMethod>(method: T):
Promise<NativeRequestResult[T] | void> {
	return new Promise((resolve) => {
		chrome.runtime.sendNativeMessage(APP_NAME, { method }, resolve);
	});
}

export const sendExtensionMessage = (request: any) => new Promise((resolve) => {
	chrome.runtime.sendMessage(request);

	resolve();
});
