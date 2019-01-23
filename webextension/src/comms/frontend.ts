import { browser } from 'webextension-polyfill-ts';
import { BackendRequest } from './shared';

export const sendBackendMessage = (request: BackendRequest): Promise<void> => browser.runtime.sendMessage(request);

export const requestBookmarks = () => sendBackendMessage({ requestBookmarks: true });

export const getActiveTab = () => browser.tabs.query({ active: true, currentWindow: true }).then(tabs => tabs[0]);
