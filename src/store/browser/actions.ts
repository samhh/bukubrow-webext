import { createAsyncAction } from 'typesafe-actions';
import { BrowserActionTypes } from './types';

export const setPageMeta = createAsyncAction(
	BrowserActionTypes.SyncBrowserRequest,
	BrowserActionTypes.SyncBrowserSuccess,
	BrowserActionTypes.SyncBrowserFailure,
)<void, { pageTitle: string; pageUrl: string }, void>();

