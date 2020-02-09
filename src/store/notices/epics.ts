/* eslint-disable @typescript-eslint/explicit-function-return-type */

import sleep from '~~/modules/sleep';
import { ThunkAC } from '~~/store';
import { addError, deleteError } from './actions';
import { NoticeId, NoticeMsg } from './types';
import { createUuid } from '~~/modules/uuid';
import { runTask } from '~~/modules/fp';

export const addPermanentError = (errorMsg: NoticeMsg): ThunkAC<NoticeId> => (dispatch, getState) => {
	const errorIds = Object.keys(getState().notices.errors);
	const newId = String(createUuid(errorIds.map(Number)));

	dispatch(addError(newId, errorMsg));

	return newId;
};

export const addTransientError = (errorMsg: NoticeMsg, timeout = 5000): ThunkAC<Promise<void>> => async (dispatch) => {
	const id = dispatch(addPermanentError(errorMsg));

	await runTask(sleep(timeout));

	dispatch(deleteError(id));
};

