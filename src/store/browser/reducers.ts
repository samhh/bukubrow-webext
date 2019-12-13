import { ActionType } from 'typesafe-actions';
import { identity, constant } from 'fp-ts/lib/function';
import * as browserActions from './actions';
import { BrowserState, BrowserActionTypes } from './types';
import { curryReducer } from 'Modules/redux';

export type BrowserActions = ActionType<typeof browserActions>;

const initialState: BrowserState = {
	pageTitle: '',
	pageUrl: '',
};

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const browserReducer = curryReducer<BrowserActions, BrowserState>((a) => (_s) => {
	switch (a.type) {
		case BrowserActionTypes.SyncBrowser:
			return constant(a.payload);

		default:
			return identity;
	}
})(initialState);

export default browserReducer;

