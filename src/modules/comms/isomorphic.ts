/**
 * @file
 *
 * I couldn't think of a better way to name this file/concept. It's for shared
 * communication between the frontend and backend.
 */

import { pipe } from 'fp-ts/lib/pipeable';
import { constVoid } from 'fp-ts/lib/function';
import * as TE from 'fp-ts/lib/TaskEither';
import * as A from 'fp-ts/Array';
import { browser } from 'webextension-polyfill-ts';
import { asError } from '~/modules/error';
import { values } from 'fp-ts-std/Record';
import { eqStrict } from 'fp-ts/lib/Eq';

const sendMessage = (x: unknown): TaskEither<Error, unknown> =>
	TE.tryCatch(() => browser.runtime.sendMessage(x), asError);

export enum IsomorphicMessage {
	BookmarksUpdatedInLocalStorage = 'bookmarks_updated_in_local_storage',
	SettingsUpdated = 'settings_updated',
	OpenAddBookmarkCommand = 'open_add_bookmark_command',
}

const isIsomorphicMessage: Refinement<unknown, IsomorphicMessage> = (x: unknown): x is IsomorphicMessage => pipe(
	values(IsomorphicMessage),
	A.elem(eqStrict)(x),
);

export const sendIsomorphicMessage = (x: IsomorphicMessage): TaskEither<Error, void> => pipe(
	sendMessage(x),
	TE.map(constVoid),
);

export const listenForIsomorphicMessages = (f: (m: IsomorphicMessage) => void): IO<void> => (): void => {
	const g = (x: unknown): void => {
		if (isIsomorphicMessage(x)) f(x);
	};

	browser.runtime.onMessage.addListener(g);
	browser.contextMenus.onClicked.addListener(g);
};

