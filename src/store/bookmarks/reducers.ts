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
	stagedBookmarksGroupEditId: Nothing,
	stagedBookmarksGroupBookmarkEditId: Nothing,
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

		case BookmarksActionTypes.DeleteStagedBookmarksGroup:
			return {
				...state,
				stagedBookmarksGroups: state.stagedBookmarksGroups.filter(grp => grp.id !== action.payload),
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

		case BookmarksActionTypes.SetStagedBookmarksGroupEditId:
			return {
				...state,
				stagedBookmarksGroupEditId: action.payload,
			};

		case BookmarksActionTypes.SetStagedBookmarksGroupBookmarkEditId:
			return {
				...state,
				stagedBookmarksGroupBookmarkEditId: action.payload,
			};

		case BookmarksActionTypes.UpdateStagedBookmarksGroupBookmark: {
			const [groupId, bookmark] = action.payload;

			return {
				...state,
				stagedBookmarksGroups: state.stagedBookmarksGroups.map((group) => {
					if (group.id !== groupId) return group;

					return {
						...group,
						bookmarks: group.bookmarks.map(oldBookmark => oldBookmark.id === bookmark.id
							? bookmark
							: oldBookmark,
						),
					};
				}),
			};
		}

		case BookmarksActionTypes.DeleteStagedBookmarksGroupBookmark: {
			const [groupId, bookmarkId] = action.payload;

			return {
				...state,
				stagedBookmarksGroups: state.stagedBookmarksGroups.map((group) => {
					if (group.id !== groupId) return group;

					return {
						...group,
						bookmarks: group.bookmarks.filter(bm => bm.id !== bookmarkId),
					};
				}),
			};
		}

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
