import { action } from 'typesafe-actions';
import { UserActionTypes, Theme } from './types';

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
