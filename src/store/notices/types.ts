import { Lens } from 'monocle-ts';

export type NoticeMsg = string;
export type NoticeId = string;

export interface NoticesState {
	errors: Record<NoticeId, NoticeMsg | undefined>;
}

export const errors = Lens.fromProp<NoticesState>()('errors');

export enum NoticesActionTypes {
	AddError = 'ADD_ERROR',
	DeleteError = 'DELETE_ERROR',
}
