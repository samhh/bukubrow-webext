import { Reducer } from 'redux';
import { ActionType } from 'typesafe-actions';
import * as browserActions from './actions';
import { BrowserState, BrowserActionTypes } from './types';

export type BrowserActions = ActionType<typeof browserActions>;

const initialState = {
	pageTitle: '',
	pageUrl: '',
};

const browserReducer: Reducer<BrowserState, BrowserActions> = (state = initialState, action) => {
	switch (action.type) {
		case BrowserActionTypes.SyncBrowserSuccess:
			return {
				...state,
				pageTitle: action.payload.pageTitle,
				pageUrl: action.payload.pageUrl,
			};

		default:
			return state;
	}
};

export default browserReducer;
