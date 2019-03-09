import { browser, Tabs } from 'webextension-polyfill-ts';
import { Maybe } from 'purify-ts/Maybe';
import { NonEmptyList } from 'purify-ts/NonEmptyList';
import { getActiveTab, getAllTabs, getActiveWindowTabs, saveStagedBookmarksAsNewGroupToLocalStorage } from 'Comms/browser';
import { MaybeTuple } from './adt';

enum ContextMenuEntry {
	SendAllTabs = 'send_all_tabs_to_bukubrow',
	SendActiveWindowTabs = 'send_active_window_tabs_to_bukubrow',
	SendActiveTab = 'send_active_tab_to_bukubrow',
	SendLink = 'send_link_to_bukubrow',
}

type SufficientTab = Required<Pick<Tabs.Tab, 'title' | 'url'>>;

export const sendTabsToStagingArea = (tabs: NonEmptyList<SufficientTab>) =>
	saveStagedBookmarksAsNewGroupToLocalStorage(tabs.map(tab => ({
		title: tab.title,
		desc: '',
		url: tab.url,
		tags: [],
		flags: 0,
	})));

export const initContextMenusAndListen = (cb: (tabs: NonEmptyList<SufficientTab>) => void) => {
	browser.contextMenus.onClicked.addListener(async (info) => {
		let tabs: Maybe<NonEmptyList<SufficientTab>>;

		switch (info.menuItemId) {
			case ContextMenuEntry.SendAllTabs: {
				const allTabs = await getAllTabs().run();
				tabs = allTabs
					.map(tabs => tabs
						.filter((tab): tab is Tabs.Tab & SufficientTab => !!tab.title && !!tab.url)
						.map((tab): SufficientTab => ({ title: tab.title, url: tab.url }))
					)
					.chain(NonEmptyList.fromArray);
				break;
			}
			case ContextMenuEntry.SendActiveWindowTabs: {
				const allWindowTabs = await getActiveWindowTabs().run();
				tabs = allWindowTabs
					.map(tabs => tabs
						.filter((tab): tab is Tabs.Tab & SufficientTab => !!tab.title && !!tab.url)
						.map((tab): SufficientTab => ({ title: tab.title, url: tab.url }))
					)
					.chain(NonEmptyList.fromArray);
				break;
			}
			case ContextMenuEntry.SendActiveTab: {
				const activeTab = await getActiveTab().run();
				tabs = activeTab
					.chain((tab): Maybe<SufficientTab> => MaybeTuple
						.fromNullable(tab.title, tab.url)
						.map(([title, url]) => ({ title, url }))
					)
					.chain(tab => NonEmptyList.fromArray([tab]));
				break;
			}
			case ContextMenuEntry.SendLink: {
				tabs = Maybe.fromNullable(info.pageUrl)
					.map(url => ({ url, title: url }))
					.chain(tab => NonEmptyList.fromArray([tab]));
				break;
			}
			default: return;
		}

		tabs.ifJust(cb);
	});

	browser.contextMenus.create({ id: ContextMenuEntry.SendAllTabs, title: 'Send all tabs to Bukubrow', contexts: ['page'] });
	browser.contextMenus.create({ id: ContextMenuEntry.SendActiveWindowTabs, title: 'Send window tabs to Bukubrow', contexts: ['page'] });
	browser.contextMenus.create({ id: ContextMenuEntry.SendActiveTab, title: 'Send tab to Bukubrow', contexts: ['page'] });
	browser.contextMenus.create({ id: ContextMenuEntry.SendLink, title: 'Send link to Bukubrow', contexts: ['link'] });
};
