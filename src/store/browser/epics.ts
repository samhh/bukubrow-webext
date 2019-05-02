import { MaybeTuple } from 'Modules/adt';
import { getActiveTab } from 'Comms/browser';
import { ThunkAC } from 'Store';
import { setPageMeta } from './actions';

export const syncBrowserInfo = (): ThunkAC<Promise<void>> => async (dispatch) => {
	const tab = await getActiveTab().run();

	tab
		.chain(tab => MaybeTuple.fromNullable(tab.title, tab.url))
		.ifJust(([title, url]) => {
			dispatch(setPageMeta(title, url));
		});
};
