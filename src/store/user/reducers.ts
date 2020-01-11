import { ActionType } from 'typesafe-actions';
import * as userActions from './actions';
import {
	UserState, UserActionTypes, Theme, Page,
	hasBinaryComms, activeTheme, displayOpenAllBookmarksConfirmation, page,
} from './types';
import {identity} from 'fp-ts/lib/function';
import { curryReducer } from '~/modules/redux';

export type UserActions = ActionType<typeof userActions>;

const initialState: UserState = {
	hasBinaryComms: false,
	activeTheme: Theme.Light,
	displayOpenAllBookmarksConfirmation: false,
	page: Page.Search,
};

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const userReducer = curryReducer<UserActions, UserState>((a) => (_s) => {
	switch (a.type) {
		case UserActionTypes.SetHasBinaryComms:
			return hasBinaryComms.set(a.payload);

		case UserActionTypes.SetActiveTheme:
			return activeTheme.set(a.payload);

		case UserActionTypes.SetDisplayOpenAllBookmarksConfirmation:
			return displayOpenAllBookmarksConfirmation.set(a.payload);

		case UserActionTypes.SetPage:
			return page.set(a.payload);

		default:
			return identity;
	}
})(initialState);

export default userReducer;

