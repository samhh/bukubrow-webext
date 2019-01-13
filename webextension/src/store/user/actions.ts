import { action } from 'typesafe-actions';
import { UserActionTypes } from './types';

export const setDisplayTutorialMessage = (display: boolean) => action(
	UserActionTypes.SetDisplayTutorialMessage,
	display,
);
