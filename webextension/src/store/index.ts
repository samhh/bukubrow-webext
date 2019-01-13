import { createStore, combineReducers, applyMiddleware, Action } from 'redux';
import thunk, { ThunkMiddleware, ThunkAction } from 'redux-thunk';
import { composeWithDevTools } from 'remote-redux-devtools';
import { onLoad } from 'Store/epics';

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

type PayloadAction<T extends string, P> = Action<T> & { payload: P; };
export type ThunkActionCreator<A extends PayloadAction<string, any> = AllActions, R = void> =
	ThunkAction<R, AppState, undefined, A>;

const middleware = applyMiddleware(thunk as ThunkMiddleware<AppState, AllActions>);
const store = createStore(
	rootReducer,
	// Assertion fixes devtools compose breaking thunk middleware type override
	composeWithDevTools(middleware) as typeof middleware,
);

store.dispatch(onLoad());

export default store;
