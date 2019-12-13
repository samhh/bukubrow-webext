import { Lens } from 'monocle-ts';

export interface BrowserState {
	pageTitle: string;
	pageUrl: string;
}

export const pageTitle = Lens.fromProp<BrowserState>()('pageTitle');
export const pageUrl = Lens.fromProp<BrowserState>()('pageUrl');

export enum BrowserActionTypes {
	SyncBrowser = 'SYNC_BROWSER',
}

