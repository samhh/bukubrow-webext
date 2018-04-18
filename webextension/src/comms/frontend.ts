import { BackendRequest } from './shared';

export const sendBackendMessage = (request: BackendRequest) =>
	new Promise((resolve) => {
		chrome.runtime.sendMessage(request);

		resolve();
	});
