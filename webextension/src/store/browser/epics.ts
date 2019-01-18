import { getActiveTab } from 'Comms/frontend';
import { ThunkActionCreator } from 'Store';
import { BrowserActions } from './reducers';
import { setPageMeta } from './actions';

type BrowserThunkActionCreator<R = void> = ThunkActionCreator<BrowserActions, R>;

export const syncBrowserInfo = (): BrowserThunkActionCreator<Promise<void>> => async (dispatch) => {
	const tab = await getActiveTab();

	if (!tab.title || !tab.url) return;

	dispatch(setPageMeta(tab.title, tab.url));
};
