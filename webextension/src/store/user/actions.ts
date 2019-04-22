import { action } from 'typesafe-actions';
import { UserActionTypes, Theme, Page } from './types';

export const setDisplayTutorialMessage = (display: boolean) => action(
	UserActionTypes.SetDisplayTutorialMessage,
	display,
);

export const setActiveTheme = (theme: Theme) => action(
	UserActionTypes.SetActiveTheme,
	theme,
);

export const setDisplayOpenAllBookmarksConfirmation = (display: boolean) => action(
	UserActionTypes.SetDisplayOpenAllBookmarksConfirmation,
	display,
);

export const setPage = (page: Page) => action(
	UserActionTypes.SetPage,
	page,
);
