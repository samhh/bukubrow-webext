/**
 * @file
 *
 * I couldn't think of a better way to name this file/concept. It's for shared
 * communication between the frontend and backend.
 */

import { pipe } from 'fp-ts/lib/pipeable';
import { constVoid, flow } from 'fp-ts/lib/function';
import * as TE from 'fp-ts/lib/TaskEither';
import * as TO from 'fp-ts-contrib/lib/TaskOption';
import * as O from 'fp-ts/lib/Option';
import { browser } from 'webextension-polyfill-ts';
import { asError } from '~/modules/error';
import { values } from '~/modules/record';
import { includes } from '~/modules/array';
import { flip, runTask } from '~/modules/fp';

const createIsomorphicMessageListener = <A>(g: (a: A) => void) => (f: (x: unknown) => TaskOption<A>): IO<void> => (): void =>
	browser.contextMenus.onClicked.addListener((x) => {
		runTask(f(x)).then((y) => {
			if (O.isSome(y)) g(y.value);
		});
	});

const sendMessage = (d: unknown): TaskEither<Error, unknown> =>
	TE.tryCatch(() => browser.runtime.sendMessage(d), asError);

export enum IsomorphicMessage {
	BookmarksUpdatedInLocalStorage = 'bookmarks_updated_in_local_storage',
	SettingsUpdated = 'settings_updated',
}

const isIsomorphicMessage: Refinement<unknown, IsomorphicMessage> = (x: unknown): x is IsomorphicMessage => pipe(
	values(IsomorphicMessage),
	flip(includes)(x),
);

export const sendIsomorphicMessage = (x: IsomorphicMessage): TaskEither<Error, void> => pipe(
	sendMessage(x),
	TE.map(constVoid),
);

export const listenForIsomorphicMessages = (f: (m: IsomorphicMessage) => void): IO<void> =>
	createIsomorphicMessageListener(f)(flow(
		O.fromPredicate(isIsomorphicMessage),
		TO.fromOption,
	));

