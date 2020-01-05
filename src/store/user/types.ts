import { Lens } from 'monocle-ts';
import { Theme } from '~/modules/settings';
export { Theme };

export interface UserState {
	hasBinaryComms: boolean;
	activeTheme: Theme;
	displayOpenAllBookmarksConfirmation: boolean;
	page: Page;
}

export const hasBinaryComms = Lens.fromProp<UserState>()('hasBinaryComms');
export const activeTheme = Lens.fromProp<UserState>()('activeTheme');
export const displayOpenAllBookmarksConfirmation = Lens.fromProp<UserState>()('displayOpenAllBookmarksConfirmation');
export const page = Lens.fromProp<UserState>()('page');

export enum UserActionTypes {
	SetHasBinaryComms = 'SET_HAS_BINARY_COMMS',
	SetActiveTheme = 'SET_ACTIVE_THEME',
	SetDisplayOpenAllBookmarksConfirmation = 'SET_OPEN_ALL_BOOKMARKS_CONFIRMATION',
	SetPage = 'SET_PAGE',
}

export enum Page {
	Search,
	AddBookmark,
	EditBookmark,
	StagedGroupsList,
	StagedGroup,
	EditStagedBookmark,
}
