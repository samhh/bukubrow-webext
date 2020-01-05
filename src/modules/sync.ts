import * as TE from 'fp-ts/lib/TaskEither';
import { browser, Storage } from 'webextension-polyfill-ts';
import { asError } from '~/modules/error';

export const getSyncStorage = (ks: Array<string> = []): TaskEither<Error, unknown> =>
	TE.tryCatch(() => browser.storage.sync.get(ks), asError);

export const setSyncStorage = (xs: Storage.StorageAreaSetItemsType): TaskEither<Error, void> =>
	TE.tryCatch(() => browser.storage.sync.set(xs), asError);

