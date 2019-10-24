// I couldn't think of a better way to name this file/concept. It's for shared
// communication between the frontend and backend.

import { browser } from 'webextension-polyfill-ts';

export enum IsomorphicMessage {
	BookmarksUpdatedInLocalStorage = 'bookmarks_updated_in_local_storage',
	SettingsUpdated = 'settings_updated',
}

export const sendIsomorphicMessage = (msg: IsomorphicMessage) => browser.runtime.sendMessage(msg);

const isIsomorphicMessage = (msg: unknown): msg is IsomorphicMessage =>
	(Object.values(IsomorphicMessage) as unknown[]).includes(msg);

export const listenForIsomorphicMessages = (cb: (msg: IsomorphicMessage) => void) => {
	browser.runtime.onMessage.addListener((msg: unknown) => {
		if (!isIsomorphicMessage(msg)) return;

		cb(msg);
	});
};
