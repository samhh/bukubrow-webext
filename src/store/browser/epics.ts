import { option, fromNullable, isSome } from 'fp-ts/lib/Option';
import { optionTuple } from 'Types/optionTuple';
import { getActiveTab } from 'Comms/browser';
import { ThunkAC } from 'Store';
import { setPageMeta } from './actions';

export const syncBrowserInfo = (): ThunkAC<Promise<void>> => async (dispatch) => {
	const tab = option.chain(
		await getActiveTab(),
		tab => optionTuple(fromNullable(tab.title), fromNullable(tab.url)),
	);

	if (isSome(tab)) {
		const [title, url] = tab.value;
		dispatch(setPageMeta(title, url));
	}
};

