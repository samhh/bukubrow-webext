import { Reducer } from 'redux';
import { ActionType } from 'typesafe-actions';
import * as userActions from './actions';
import { UserState, UserActionTypes, Theme, Page } from './types';

export type UserActions = ActionType<typeof userActions>;

const initialState = {
	hasBinaryComms: false,
	activeTheme: Theme.Light,
	displayOpenAllBookmarksConfirmation: false,
	page: Page.Search,
};

const userReducer: Reducer<UserState, UserActions> = (state = initialState, action) => {
	switch (action.type) {
		case UserActionTypes.SetHasBinaryComms:
			return {
				...state,
				hasBinaryComms: action.payload,
			};

		case UserActionTypes.SetActiveTheme:
			return {
				...state,
				activeTheme: action.payload,
			};

		case UserActionTypes.SetDisplayOpenAllBookmarksConfirmation:
			return {
				...state,
				displayOpenAllBookmarksConfirmation: action.payload,
			};

		case UserActionTypes.SetPage:
			return {
				...state,
				page: action.payload,
			};

		default:
			return state;
	}
};

export default userReducer;
