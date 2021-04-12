import { pipe } from 'fp-ts/lib/pipeable';
import { identity, constant, flow, not } from 'fp-ts/lib/function';
import * as O from 'fp-ts/lib/Option';
import * as A from 'fp-ts/lib/Array';
import * as S from 'fp-ts-std/String';
import { ActionType } from 'typesafe-actions';
import * as bookmarksActions from './actions';
import {
	BookmarksState, BookmarksActionTypes, bookmarks, stagedBookmarksGroups,
	limitNumRendered, focusedBookmarkIndex, bookmarkEditId, bookmarkDeleteId,
	stagedBookmarksGroupEditId, stagedBookmarksGroupBookmarkEditId,
	displayDeleteBookmarkModal,
} from './types';
import { curryReducer } from '~/modules/redux';
import { id as grpId, bookmarks as grpBms } from '~/modules/staged-groups';
import { mapByPredicate } from '~/modules/array';
import { id as bmId, id } from '~/modules/bookmarks';
import { eqNumber } from '~/modules/eq';
import { fromArray } from '~/modules/record';

export type BookmarksActions = ActionType<typeof bookmarksActions>;

const initialState: BookmarksState = {
	bookmarks: {},
	stagedBookmarksGroups: [],
	limitNumRendered: true,
	focusedBookmarkIndex: O.none,
	bookmarkEditId: O.none,
	bookmarkDeleteId: O.none,
	stagedBookmarksGroupEditId: O.none,
	stagedBookmarksGroupBookmarkEditId: O.none,
	displayDeleteBookmarkModal: false,
};

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const bookmarksReducer = curryReducer<BookmarksActions, BookmarksState>((a) => (_s) => {
	switch (a.type) {
		case BookmarksActionTypes.SetAllBookmarks:
			return pipe(a.payload, fromArray(flow(id.get, S.fromNumber)), bookmarks.set);

		case BookmarksActionTypes.SetAllStagedBookmarksGroups:
			return stagedBookmarksGroups.set(a.payload);

		case BookmarksActionTypes.DeleteStagedBookmarksGroup:
			return stagedBookmarksGroups.modify(A.filter(x => x.id !== a.payload));

		case BookmarksActionTypes.SetLimitNumRendered:
			return limitNumRendered.set(a.payload);

		case BookmarksActionTypes.SetFocusedBookmarkIndex:
			return focusedBookmarkIndex.set(a.payload);

		case BookmarksActionTypes.SetBookmarkEditId:
			return bookmarkEditId.set(a.payload);

		case BookmarksActionTypes.SetBookmarkDeleteId:
			return bookmarkDeleteId.set(a.payload);

		case BookmarksActionTypes.SetStagedBookmarksGroupEditId:
			return stagedBookmarksGroupEditId.set(a.payload);

		case BookmarksActionTypes.SetStagedBookmarksGroupBookmarkEditId:
			return stagedBookmarksGroupBookmarkEditId.set(a.payload);

		case BookmarksActionTypes.UpdateStagedBookmarksGroupBookmark: {
			const [newGrpId, newBm] = a.payload;
			const eqGrp = flow(grpId.get, eqNumber(newGrpId));
			const eqBm = flow(bmId.get, eqNumber(newBm.id));

			return stagedBookmarksGroups.modify(mapByPredicate(
				grpBms.modify(mapByPredicate(constant(newBm))(eqBm))
			)(eqGrp));
		}

		case BookmarksActionTypes.DeleteStagedBookmarksGroupBookmark: {
			const [newGrpId, newBmId] = a.payload;
			const eqGrp = flow(grpId.get, eqNumber(newGrpId));
			const eqBm = flow(bmId.get, eqNumber(newBmId));

			return stagedBookmarksGroups.modify(mapByPredicate(
				grpBms.modify(A.filter(not(eqBm))),
			)(eqGrp));
		}

		case BookmarksActionTypes.SetDeleteBookmarkModalDisplay:
			return displayDeleteBookmarkModal.set(a.payload);

		default:
			return identity;
	}
})(initialState);

export default bookmarksReducer;

