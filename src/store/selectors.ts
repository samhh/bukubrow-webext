/* eslint-disable @typescript-eslint/explicit-function-return-type */

import { pipe } from 'fp-ts/lib/pipeable';
import { constant, identity } from 'fp-ts/lib/function';
import * as O from 'fp-ts/lib/Option';
import * as OT from '~/modules/optionTuple';
import * as A from 'fp-ts/lib/Array';
import { createSelector } from 'reselect';
import { AppState } from '~/store';
import parseSearchInput from '~/modules/parse-search-input';
import { filterBookmarks, ordLocalBookmarkWeighted, LocalBookmark, LocalBookmarkWeighted } from '~/modules/bookmarks';
import { MAX_BOOKMARKS_TO_RENDER } from '~/modules/config';
import { URLMatch, match } from '~/modules/compare-urls';
import { fromString } from '~/modules/url';
import { StagedBookmarksGroup, ordStagedBookmarksGroup } from '~/modules/staged-groups';
import { lookupC } from '~/modules/array';
import { flip } from '~/modules/fp';

const addBookmarkWeight = (activeTabURL: Option<URL>) => (bookmark: LocalBookmark): LocalBookmarkWeighted => ({
	...bookmark,
	weight: pipe(
		OT.optionTuple(activeTabURL, pipe(bookmark.url, fromString, O.fromEither)),
		O.map(([activeURL, bmURL]) => match(activeURL)(bmURL)),
		O.getOrElse<URLMatch>(constant(URLMatch.None)),
	),
});

const getBookmarks = (state: AppState) => state.bookmarks.bookmarks;
const getFocusedBookmarkIndex = (state: AppState) => state.bookmarks.focusedBookmarkIndex;
const getBookmarkEditId = (state: AppState) => state.bookmarks.bookmarkEditId;
const getBookmarkDeleteId = (state: AppState) => state.bookmarks.bookmarkDeleteId;
const getLimitNumRendered = (state: AppState) => state.bookmarks.limitNumRendered;
const getStagedGroups = (state: AppState) => state.bookmarks.stagedBookmarksGroups;
const getStagedGroupEditId = (state: AppState) => state.bookmarks.stagedBookmarksGroupEditId;
const getStagedGroupBookmarkEditId = (state: AppState) => state.bookmarks.stagedBookmarksGroupBookmarkEditId;
const getSearchFilter = (state: AppState) => state.input.searchFilter;
const getActiveTabHref = (state: AppState) => state.browser.pageUrl;

/**
 * Parse search input/filter.
 */
export const getParsedFilter = createSelector(getSearchFilter, parseSearchInput);

/**
 * Filter all bookmarks by search filter.
 */
export const getUnlimitedFilteredBookmarks = createSelector(getBookmarks, getParsedFilter, filterBookmarks);

/**
 * Filter all bookmarks by search filter, apply weighting, and sort them by
 * weight.
 */
export const getWeightedUnlimitedFilteredBookmarks = createSelector(getUnlimitedFilteredBookmarks, getActiveTabHref,
	(bookmarks, activeTabHref) => pipe(
		bookmarks,
		A.map(pipe(activeTabHref, fromString, O.fromEither, addBookmarkWeight)),
		A.sort(ordLocalBookmarkWeighted),
	));

/**
 * Filter all bookmarks by search filter, apply weighting, sort them by weight,
 * and potentially return only a limited subset of them according to the store.
 */
export const getWeightedLimitedFilteredBookmarks = createSelector(getWeightedUnlimitedFilteredBookmarks, getLimitNumRendered,
	(bookmarks, limitNumRendered) => pipe(
		bookmarks,
		limitNumRendered ? A.takeLeft(MAX_BOOKMARKS_TO_RENDER) : identity,
	));

/**
 * Return the number of bookmarks matching the filter being removed by the limit.
 */
export const getNumFilteredUnrenderedBookmarks = createSelector(getUnlimitedFilteredBookmarks, getWeightedLimitedFilteredBookmarks,
	(us, ls) => Math.max(0, us.length - ls.length));

export const getFocusedBookmark = createSelector(getWeightedLimitedFilteredBookmarks, getFocusedBookmarkIndex,
	(bookmarks, focusedId) => pipe(
		focusedId,
		O.chain(flip(lookupC)(bookmarks)),
	));

export const getBookmarkToEdit = createSelector(getBookmarks, getBookmarkEditId,
	(bookmarks, editId) => pipe(
		editId,
		O.chain(eid => A.findFirst<LocalBookmark>(bm => bm.id === eid)(bookmarks)),
	));

export const getBookmarkToDelete = createSelector(getBookmarks, getBookmarkDeleteId,
	(bookmarks, deleteId) => pipe(
		deleteId,
		O.chain(did => A.findFirst<LocalBookmark>(bm => bm.id === did)(bookmarks)),
	));

export const getSortedStagedGroups = createSelector(getStagedGroups, A.sort(ordStagedBookmarksGroup), A.reverse);

export const getStagedGroupToEdit = createSelector(getStagedGroups, getStagedGroupEditId,
	(groups, editId) => pipe(
		editId,
		O.chain(eid => A.findFirst<StagedBookmarksGroup>(grp => grp.id === eid)(groups)),
	));

/**
 * Get weighted bookmarks from the staging area group selected for editing.
 */
export const getStagedGroupToEditWeightedBookmarks = createSelector(getStagedGroupToEdit, getActiveTabHref,
	(group, activeTabHref) => pipe(
		group,
		O.map(grp => grp.bookmarks.map(pipe(activeTabHref, fromString, O.fromEither, addBookmarkWeight))),
	));

export const getStagedGroupBookmarkToEdit = createSelector(getStagedGroupToEdit, getStagedGroupBookmarkEditId,
	(group, editId) => pipe(
		OT.optionTuple(group, editId),
		O.chain(([{ bookmarks }, eid]) => A.findFirst((bm: LocalBookmark) => bm.id === eid)(bookmarks)),
	));

