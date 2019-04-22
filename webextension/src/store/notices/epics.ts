import sleep from 'Modules/sleep';
import { ThunkAC } from 'Store';
import { addError, deleteError } from './actions';
import { NoticeId, NoticeMsg } from './types';

let id = 0;
export const pushError = (
	errorMsg: NoticeMsg,
	timeout: number | false = 5000,
): ThunkAC<Promise<void>> => async (dispatch) => {
	const thisId: NoticeId = String(id++);

	dispatch(addError(thisId, errorMsg));

	if (timeout === false) return;

	await sleep(timeout);

	dispatch(deleteError(thisId));
};
