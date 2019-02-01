import { MaybeTuple } from 'Modules/adt';
import { getActiveTab } from 'Comms/frontend';
import { ThunkActionCreator } from 'Store';
import { BrowserActions } from './reducers';
import { setPageMeta } from './actions';

type BrowserThunkActionCreator<R = void> = ThunkActionCreator<BrowserActions, R>;

export const syncBrowserInfo = (): BrowserThunkActionCreator<Promise<void>> => async (dispatch) => {
	const mtab = await getActiveTab();

	mtab
		.chain(tab => MaybeTuple.fromNullable(tab.title, tab.url))
		.ifJust(([title, url]) => {
			dispatch(setPageMeta(title, url));
		});
};
