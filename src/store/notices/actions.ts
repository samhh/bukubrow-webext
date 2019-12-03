import { action } from 'typesafe-actions';
import { NoticesActionTypes, NoticeId, NoticeMsg } from './types';

export const requestPermanentError = (msg: NoticeMsg) => action(
	NoticesActionTypes.AddPermanentErrorRequest,
	msg,
);

export const requestTransientError = (msg: NoticeMsg) => action(
	NoticesActionTypes.AddTransientErrorRequest,
	msg,
);

export const addError = (id: NoticeId, msg: NoticeMsg, timeout: number) => action(
	NoticesActionTypes.AddError,
	{ key: id, value: msg, timeout },
);

export const deleteError = (id: NoticeId) => action(
	NoticesActionTypes.DeleteError,
	id,
);
