import { Nothing } from 'purify-ts/Maybe';
import { Reducer } from 'redux';
import { ActionType } from 'typesafe-actions';
import * as bookmarksActions from './actions';
import { BookmarksState, BookmarksActionTypes } from './types';

export type BookmarksActions = ActionType<typeof bookmarksActions>;

const initialState = {
	bookmarks: [],
	stagedBookmarksGroups: [],
	limitNumRendered: true,
	focusedBookmarkIndex: Nothing,
	bookmarkEditId: Nothing,
	bookmarkDeleteId: Nothing,
	displayAddBookmarkModal: false,
	displayEditBookmarkModal: false,
	displayDeleteBookmarkModal: false,
};

const bookmarksReducer: Reducer<BookmarksState, BookmarksActions> = (state = initialState, action) => {
	switch (action.type) {
		case BookmarksActionTypes.SetAllBookmarks:
			return {
				...state,
				bookmarks: [...action.payload],
			};
		case BookmarksActionTypes.SetAllStagedBookmarksGroups:
			return {
				...state,
				stagedBookmarksGroups: [...action.payload],
			};
		case BookmarksActionTypes.SetLimitNumRendered:
			return {
				...state,
				limitNumRendered: action.payload,
			};
		case BookmarksActionTypes.SetFocusedBookmarkIndex:
			return {
				...state,
				focusedBookmarkIndex: action.payload,
			};
		case BookmarksActionTypes.SetBookmarkEditId:
			return {
				...state,
				bookmarkEditId: action.payload,
			};
		case BookmarksActionTypes.SetBookmarkDeleteId:
			return {
				...state,
				bookmarkDeleteId: action.payload,
			};
		case BookmarksActionTypes.SetAddBookmarkModalDisplay:
			return {
				...state,
				displayAddBookmarkModal: action.payload,
			};
		case BookmarksActionTypes.SetEditBookmarkModalDisplay:
			return {
				...state,
				displayEditBookmarkModal: action.payload,
			};
		case BookmarksActionTypes.SetDeleteBookmarkModalDisplay:
			return {
				...state,
				displayDeleteBookmarkModal: action.payload,
			};
		default:
			return state;
	}
};

export default bookmarksReducer;
