import { Lens } from 'monocle-ts';
import { AppState } from '~/store/';

export type NoticeMsg = string;
export type NoticeId = string;

export interface NoticesState {
	errors: Record<NoticeId, NoticeMsg>;
}

export const noticesL = Lens.fromProp<AppState>()('notices');

export const errors = Lens.fromProp<NoticesState>()('errors');
export const errorsL = noticesL.compose(errors);

export enum NoticesActionTypes {
	AddError = 'ADD_ERROR',
	DeleteError = 'DELETE_ERROR',
}

