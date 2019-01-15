export interface UserState {
	displayTutorialMessage: boolean;
	displayOpenAllBookmarksConfirmation: boolean;
}

export enum UserActionTypes {
	SetDisplayTutorialMessage = 'SET_DISPLAY_TUTORIAL_MESSAGE',
	SetDisplayOpenAllBookmarksConfirmation = 'SET_OPEN_ALL_BOOKMARKS_CONFIRMATION',
}
