import { Maybe } from 'purify-ts/Maybe';
import { List } from 'purify-ts/List';
import { MaybeTuple } from 'Modules/adt';
import { createSelector } from 'reselect';
import { AppState } from 'Store';
import parseSearchInput from 'Modules/parse-search-input';
import { filterBookmarks, sortBookmarks, LocalBookmarkWeighted } from 'Modules/bookmarks';
import { MAX_BOOKMARKS_TO_RENDER } from 'Modules/config';
import compareURLs, { URLMatch } from 'Modules/compare-urls';

const addBookmarkWeight = (activeTabURL: Maybe<URL>) => (bookmark: LocalBookmark): LocalBookmarkWeighted => ({
	...bookmark,
	weight: MaybeTuple.fromMaybe(activeTabURL, Maybe.encase(() => new URL(bookmark.url)))
		.map(([activeURL, bmURL]) => compareURLs(activeURL, bmURL))
		.orDefault(URLMatch.None),
});

const getBookmarks = (state: AppState) => state.bookmarks.bookmarks;
const getFocusedBookmarkIndex = (state: AppState) => state.bookmarks.focusedBookmarkIndex;
const getBookmarkEditId = (state: AppState) => state.bookmarks.bookmarkEditId;
const getBookmarkDeleteId = (state: AppState) => state.bookmarks.bookmarkDeleteId;
const getLimitNumRendered = (state: AppState) => state.bookmarks.limitNumRendered;
const getSearchFilter = (state: AppState) => state.input.searchFilter;
const getActiveTabHref = (state: AppState) => state.browser.pageUrl;

// Parse search filter
export const getParsedFilter = createSelector(getSearchFilter, parseSearchInput);

// Filter all bookmarks by search filter
export const getUnlimitedFilteredBookmarks = createSelector(getBookmarks, getParsedFilter, filterBookmarks);

// Filter all bookmarks by search filter and pin bookmarks matching active tab URL via sorting
export const getWeightedUnlimitedFilteredBookmarks = createSelector(getUnlimitedFilteredBookmarks, getActiveTabHref,
	(bookmarks, activeTabHref) => bookmarks
		.map(addBookmarkWeight(Maybe.encase(() => new URL(activeTabHref))))
		.sort(sortBookmarks),
);

// Filter all bookmarks by search filter and return potentially a limited number of them
export const getWeightedLimitedFilteredBookmarks = createSelector(getWeightedUnlimitedFilteredBookmarks, getLimitNumRendered,
	(bookmarks, limitNumRendered) => limitNumRendered
		? bookmarks.slice(0, MAX_BOOKMARKS_TO_RENDER)
		: bookmarks,
);

// Number of bookmarks filtered by search filter that aren't presently being rendered
export const getNumFilteredUnrenderedBookmarks = createSelector(getUnlimitedFilteredBookmarks, getWeightedLimitedFilteredBookmarks,
	(u, l) => u.slice(l.length).length);

export const getFocusedBookmark = createSelector(getWeightedLimitedFilteredBookmarks, getFocusedBookmarkIndex,
	(bookmarks, focusedId) => focusedId.chain(fid => List.at(fid, bookmarks)));

export const getBookmarkToEdit = createSelector(getBookmarks, getBookmarkEditId,
	(bookmarks, editId) => editId.chain(eid => Maybe.fromNullable(bookmarks.find(bm => bm.id === eid))));

export const getBookmarkToDelete = createSelector(getBookmarks, getBookmarkDeleteId,
	(bookmarks, deleteId) => deleteId.chain(did => Maybe.fromNullable(bookmarks.find(bm => bm.id === did))));
