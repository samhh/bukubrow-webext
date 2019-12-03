/* eslint-disable @typescript-eslint/explicit-function-return-type */

import { action } from 'typesafe-actions';
import { BrowserActionTypes } from './types';

export const setPageMeta = (pageTitle: string, pageUrl: string) => action(
	BrowserActionTypes.SyncBrowser,
	{ pageTitle, pageUrl },
);

