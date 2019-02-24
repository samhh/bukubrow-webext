import { Theme } from 'Modules/settings';
export { Theme };

export interface UserState {
	displayTutorialMessage: boolean;
	activeTheme: Theme;
	displayOpenAllBookmarksConfirmation: boolean;
}

export enum UserActionTypes {
	SetDisplayTutorialMessage = 'SET_DISPLAY_TUTORIAL_MESSAGE',
	SetActiveTheme = 'SET_ACTIVE_THEME',
	SetDisplayOpenAllBookmarksConfirmation = 'SET_OPEN_ALL_BOOKMARKS_CONFIRMATION',
}
