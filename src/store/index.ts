import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk, { ThunkMiddleware, ThunkAction } from 'redux-thunk';
import { composeWithDevTools } from 'remote-redux-devtools';
import { useSelector as useSelectorUntyped, useDispatch as useDispatchRaw, TypedUseSelectorHook } from 'react-redux';
import { onLoad } from 'Store/epics';
import { saveStagedBookmarksGroupsToLocalStorage, saveBookmarksToLocalStorage } from 'Comms/browser';

import bookmarksReducer, { BookmarksActions } from './bookmarks/reducers';
import browserReducer, { BrowserActions } from './browser/reducers';
import inputReducer, { InputActions } from './input/reducers';
import noticesReducer, { NoticesActions } from './notices/reducers';
import userReducer, { UserActions } from './user/reducers';

const rootReducer = combineReducers({
	bookmarks: bookmarksReducer,
	browser: browserReducer,
	input: inputReducer,
	notices: noticesReducer,
	user: userReducer,
});

export type AppState = ReturnType<typeof rootReducer>;

type AllActions =
	| BookmarksActions
	| BrowserActions
	| InputActions
	| NoticesActions
	| UserActions;

export type ThunkAC<R = void> = ThunkAction<R, AppState, undefined, AllActions>;

const middleware = applyMiddleware(thunk as ThunkMiddleware<AppState, AllActions>);
const store = createStore(
	rootReducer,
	// Assertion fixes devtools compose breaking thunk middleware type override
	composeWithDevTools(middleware) as typeof middleware,
);

store.dispatch(onLoad());

// Re-export appropriately typed hooks
export const useSelector: TypedUseSelectorHook<AppState> = useSelectorUntyped;
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const useDispatch = () => useDispatchRaw<typeof store.dispatch>();

// Keep store in sync with local cache
export const initAutoStoreSync = (): void => {
	store.subscribe(() => {
		const { bookmarks: { bookmarks, stagedBookmarksGroups } } = store.getState();

		saveBookmarksToLocalStorage(bookmarks);
		saveStagedBookmarksGroupsToLocalStorage(stagedBookmarksGroups);
	});
};

export default store;
