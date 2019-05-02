import { action } from 'typesafe-actions';
import { UserActionTypes, Theme, Page } from './types';

export const setHasBinaryComms = (hasComms: boolean) => action(
	UserActionTypes.SetHasBinaryComms,
	hasComms,
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
