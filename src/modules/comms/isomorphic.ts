// I couldn't think of a better way to name this file/concept. It's for shared
// communication between the frontend and backend.

import { constant } from 'fp-ts/lib/function';
import * as TE from 'fp-ts/lib/TaskEither';
import { browser } from 'webextension-polyfill-ts';
import { error } from 'Modules/error';

export enum IsomorphicMessage {
	BookmarksUpdatedInLocalStorage = 'bookmarks_updated_in_local_storage',
	SettingsUpdated = 'settings_updated',
}

export const sendIsomorphicMessage = (msg: IsomorphicMessage): TaskEither<Error, void> => TE.tryCatch(
	() => browser.runtime.sendMessage(msg),
	constant(error('Failed to send isomorphic message')),
);

const isIsomorphicMessage = (msg: unknown): msg is IsomorphicMessage =>
	(Object.values(IsomorphicMessage) as Array<unknown>).includes(msg);

export const listenForIsomorphicMessages = (cb: (msg: IsomorphicMessage) => void): IO<void> => (): void => {
	browser.runtime.onMessage.addListener((msg: unknown) => {
		if (!isIsomorphicMessage(msg)) return;

		cb(msg);
	});
};
