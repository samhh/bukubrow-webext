import sleep from 'Modules/sleep';
import { ThunkActionCreator } from 'Store';
import { NoticesActions } from './reducers';
import { addError, deleteError } from './actions';
import { NoticeId, NoticeMsg } from './types';

type NoticesThunkActionCreator<R = void> = ThunkActionCreator<NoticesActions, R>;

let id = 0;
export const pushError = (errorMsg: NoticeMsg, timeout: number | false = 5000):
NoticesThunkActionCreator<Promise<void>> => async (dispatch) => {
	const thisId: NoticeId = String(id++);

	dispatch(addError(thisId, errorMsg));

	if (typeof timeout !== 'number') return;

	await sleep(timeout);

	dispatch(deleteError(thisId));
};
