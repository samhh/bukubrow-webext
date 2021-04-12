import * as TE from 'fp-ts/lib/TaskEither';
import { browser } from 'webextension-polyfill-ts';
import { asError } from '~/modules/error';

export const getSyncStorage = (ks: Array<string> = []): TaskEither<Error, unknown> =>
	TE.tryCatch(() => browser.storage.sync.get(ks), asError);

export const setSyncStorage = (xs: Record<string, unknown>): TaskEither<Error, void> =>
	TE.tryCatch(() => browser.storage.sync.set(xs), asError);

