import { Option, option, map, fromEither, getOrElse } from 'fp-ts/lib/Option';
import { optionTuple } from 'Types/optionTuple';
import { pipe } from 'fp-ts/lib/pipeable';
import { findFirst, lookup } from 'fp-ts/lib/Array';
import { createSelector } from 'reselect';
import { AppState } from 'Store';
import parseSearchInput from 'Modules/parse-search-input';
import { filterBookmarks, sortBookmarks, LocalBookmarkWeighted } from 'Modules/bookmarks';
import { MAX_BOOKMARKS_TO_RENDER } from 'Modules/config';
import compareURLs, { URLMatch } from 'Modules/compare-urls';
import { createURL } from 'Modules/url';

const addBookmarkWeight = (activeTabURL: Option<URL>) => (bookmark: LocalBookmark): LocalBookmarkWeighted => ({
	...bookmark,
	weight: pipe(
		optionTuple(activeTabURL, fromEither(createURL(bookmark.url))),
		map(([activeURL, bmURL]) => compareURLs(activeURL, bmURL)),
		getOrElse(() => URLMatch.None),
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
	(bookmarks, activeTabHref) => bookmarks
		.map(addBookmarkWeight(fromEither(createURL(activeTabHref))))
		.sort(sortBookmarks),
);

/**
 * Filter all bookmarks by search filter, apply weighting, sort them by weight,
 * and potentially return only a limited subset of them according to the store.
 */
export const getWeightedLimitedFilteredBookmarks = createSelector(getWeightedUnlimitedFilteredBookmarks, getLimitNumRendered,
	(bookmarks, limitNumRendered) => limitNumRendered
		? bookmarks.slice(0, MAX_BOOKMARKS_TO_RENDER)
		: bookmarks,
);

/**
 * Return the number of bookmarks matching the filter being removed by the limit.
 */
export const getNumFilteredUnrenderedBookmarks = createSelector(getUnlimitedFilteredBookmarks, getWeightedLimitedFilteredBookmarks,
	(u, l) => u.slice(l.length).length);

export const getFocusedBookmark = createSelector(getWeightedLimitedFilteredBookmarks, getFocusedBookmarkIndex,
	(bookmarks, focusedId) => option.chain(focusedId, fid => lookup(fid, bookmarks)));

export const getBookmarkToEdit = createSelector(getBookmarks, getBookmarkEditId,
	(bookmarks, editId) => option.chain(editId, eid => findFirst((bm: LocalBookmark) => bm.id === eid)(bookmarks)));

export const getBookmarkToDelete = createSelector(getBookmarks, getBookmarkDeleteId,
	(bookmarks, deleteId) => option.chain(deleteId, did => findFirst((bm: LocalBookmark) => bm.id === did)(bookmarks)));

export const getSortedStagedGroups = createSelector(getStagedGroups,
	(grps) => [...grps].sort((a, b) => b.time - a.time));

export const getStagedGroupToEdit = createSelector(getStagedGroups, getStagedGroupEditId,
	(groups, editId) => option.chain(editId, eid => findFirst((grp: StagedBookmarksGroup) => grp.id === eid)(groups)));

/**
 * Get weighted bookmarks from the staging area group selected for editing.
 */
export const getStagedGroupToEditWeightedBookmarks = createSelector(getStagedGroupToEdit, getActiveTabHref,
	(group, activeTabHref) => option.map(group, grp => grp.bookmarks.map(addBookmarkWeight(fromEither(createURL(activeTabHref))))));

export const getStagedGroupBookmarkToEdit = createSelector(getStagedGroupToEdit, getStagedGroupBookmarkEditId,
	(group, editId) => option.chain(
		optionTuple(group, editId),
		([{ bookmarks }, eid]) => findFirst((bm: LocalBookmark) => bm.id === eid)(bookmarks),
	),
);

