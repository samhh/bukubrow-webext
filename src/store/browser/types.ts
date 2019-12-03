export interface BrowserState {
	pageTitle: string;
	pageUrl: string;
}

export enum BrowserActionTypes {
	SyncBrowserRequest = 'SYNC_BROWSER_REQUEST',
	SyncBrowserSuccess = 'SYNC_BROWSER_SUCCESS',
	SyncBrowserFailure = 'SYNC_BROWSER_FAILURE',
}
