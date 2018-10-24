import { BackendRequest } from './shared';

export const sendBackendMessage = (request: BackendRequest): Promise<void> =>
	new Promise((resolve) => {
		chrome.runtime.sendMessage(request, resolve);
	});

export const getActiveTab = (): Promise<chrome.tabs.Tab> =>
	new Promise((resolve) => {
		chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
			resolve(tab);
		});
	});
