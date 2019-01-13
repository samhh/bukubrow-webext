import { action } from 'typesafe-actions';
import { NoticesActionTypes, NoticeId, NoticeMsg } from './types';

export const addError = (id: NoticeId, msg: NoticeMsg) => action(
	NoticesActionTypes.AddError,
	{ key: id, value: msg },
);

export const deleteError = (id: NoticeId) => action(
	NoticesActionTypes.DeleteError,
	id,
);
