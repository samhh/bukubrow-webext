import { createStore, combineReducers, applyMiddleware, Action } from 'redux';
import thunk, { ThunkMiddleware, ThunkAction } from 'redux-thunk';
import { composeWithDevTools } from 'remote-redux-devtools';
import { onLoad } from 'Store/epics';
import { saveStagedBookmarksGroupsToLocalStorage } from 'Comms/browser';

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

export type AllActions =
	| BookmarksActions
	| BrowserActions
	| InputActions
	| NoticesActions
	| UserActions;

type PayloadAction<T extends string, P> = Action<T> & { payload: P };
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ThunkActionCreator<A extends PayloadAction<string, any> = AllActions, R = void> =
	ThunkAction<R, AppState, undefined, A>;

const middleware = applyMiddleware(thunk as ThunkMiddleware<AppState, AllActions>);
const store = createStore(
	rootReducer,
	// Assertion fixes devtools compose breaking thunk middleware type override
	composeWithDevTools(middleware) as typeof middleware,
);

// Keep store in sync with local cache
store.subscribe(() => {
	const { bookmarks: { stagedBookmarksGroups } } = store.getState();

	saveStagedBookmarksGroupsToLocalStorage(stagedBookmarksGroups);
});

store.dispatch(onLoad());

export default store;
