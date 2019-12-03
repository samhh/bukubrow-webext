export type NoticeMsg = string;
export type NoticeId = string;

export interface NoticesState {
	errors: Record<NoticeId, NoticeMsg | undefined>;
}

export enum NoticesActionTypes {
	AddError = 'ADD_ERROR',
	DeleteError = 'DELETE_ERROR',
}
