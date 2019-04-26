import sleep from 'Modules/sleep';
import { ThunkAC } from 'Store';
import { addError, deleteError } from './actions';
import { NoticeId, NoticeMsg } from './types';
import uuid from 'Modules/uuid';

export const addPermanentError = (errorMsg: NoticeMsg): ThunkAC<NoticeId> => (dispatch, getState) => {
	const errorIds = Object.keys(getState().notices.errors);
	const newId = String(uuid(errorIds.map(Number)));

	dispatch(addError(newId, errorMsg));

	return newId;
}; 

export const addTransientError = (
	errorMsg: NoticeMsg,
	timeout: number = 5000,
): ThunkAC<Promise<void>> => async (dispatch) => {
	const id = dispatch(addPermanentError(errorMsg));

	await sleep(timeout);

	dispatch(deleteError(id));
};
