import { Reducer } from 'redux';
import { ActionType } from 'typesafe-actions';
import * as userActions from './actions';
import { UserState, UserActionTypes } from './types';

export type UserActions = ActionType<typeof userActions>;

const initialState = {
	displayTutorialMessage: false,
	displayOpenAllBookmarksConfirmation: false,
};

const userReducer: Reducer<UserState, UserActions> = (state = initialState, action) => {
	switch (action.type) {
		case UserActionTypes.SetDisplayTutorialMessage:
			return {
				...state,
				displayTutorialMessage: action.payload,
			};
		case UserActionTypes.SetDisplayOpenAllBookmarksConfirmation:
			return {
				...state,
				displayOpenAllBookmarksConfirmation: action.payload,
			};
		default:
			return state;
	}
};

export default userReducer;
