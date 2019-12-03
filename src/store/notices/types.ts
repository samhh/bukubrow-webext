export type NoticeMsg = string;
export type NoticeId = string;

export interface NoticesState {
	errors: Dictionary<NoticeId, NoticeMsg>;
}

export enum NoticesActionTypes {
	AddError = 'ADD_ERROR',
	DeleteError = 'DELETE_ERROR',
	AddPermanentErrorRequest = 'ADD_ERROR_PERM_REQ',
	AddTransientErrorRequest = 'ADD_ERROR_TEMP_REQ',
}
