import { Theme } from 'Modules/settings';
export { Theme };

export interface UserState {
	hasBinaryComms: boolean;
	activeTheme: Theme;
	displayOpenAllBookmarksConfirmation: boolean;
	page: Page;
}

export enum UserActionTypes {
	SetHasBinaryComms = 'SET_HAS_BINARY_COMMS',
	SetActiveTheme = 'SET_ACTIVE_THEME',
	SetDisplayOpenAllBookmarksConfirmation = 'SET_OPEN_ALL_BOOKMARKS_CONFIRMATION',
	SetPage = 'SET_PAGE',
}

export enum Page {
	Search,
	StagedGroupsList,
	StagedGroup,
	EditStagedBookmark,
}
