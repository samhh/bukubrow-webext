import { browser, Tabs } from 'webextension-polyfill-ts';
import { pipe } from 'fp-ts/lib/pipeable';
import * as O from 'fp-ts/lib/Option';
import * as OT from 'Types/optionTuple';
import * as NEA from 'fp-ts/lib/NonEmptyArray';
import { getActiveTab, getAllTabs, getActiveWindowTabs, saveStagedBookmarksAsNewGroupToLocalStorage } from 'Comms/browser';

enum ContextMenuEntry {
	SendAllTabs = 'send_all_tabs_to_bukubrow',
	SendActiveWindowTabs = 'send_active_window_tabs_to_bukubrow',
	SendActiveTab = 'send_active_tab_to_bukubrow',
	SendLink = 'send_link_to_bukubrow',
}

type SufficientTab = Required<Pick<Tabs.Tab, 'title' | 'url'>>;

export const sendTabsToStagingArea = (tabs: NonEmptyArray<SufficientTab>) =>
	saveStagedBookmarksAsNewGroupToLocalStorage(NEA.nonEmptyArray.map(tabs, tab => ({
		title: tab.title,
		desc: '',
		url: tab.url,
		tags: [],
		flags: 0,
	})));

const isSufficientTab = (tab: Tabs.Tab): tab is Tabs.Tab & SufficientTab => !!tab.title && !!tab.url;
const trimSufficientTab = (tab: SufficientTab): SufficientTab => ({ title: tab.title, url: tab.url });
const toSufficientTabs = (tabs: Tabs.Tab[]) => tabs.filter(isSufficientTab).map(trimSufficientTab);

/**
 * Initialise context menu items that each obtain various viable window tabs,
 * and pass those onto the callback.
 */
export const initContextMenusAndListen = (cb: (tabs: NonEmptyArray<SufficientTab>) => void) => {
	// eslint-disable-next-line @typescript-eslint/no-misused-promises
	browser.contextMenus.onClicked.addListener(async (info) => {
		let tabs: Option<NonEmptyArray<SufficientTab>> = O.none;

		switch (info.menuItemId) {
			case ContextMenuEntry.SendAllTabs: {
				tabs = pipe(
					await getAllTabs(),
					O.map(toSufficientTabs),
					O.chain(NEA.fromArray),
				);
				break;
			}

			case ContextMenuEntry.SendActiveWindowTabs: {
				tabs = pipe(
					await getActiveWindowTabs(),
					O.map(toSufficientTabs),
					O.chain(NEA.fromArray),
				);
				break;
			}

			case ContextMenuEntry.SendActiveTab: {
				tabs = pipe(
					await getActiveTab(),
					O.chain(tab => OT.fromNullable(tab.title, tab.url)),
					O.map(([title, url]) => [{ title, url }]),
					O.chain(NEA.fromArray),
				);
				break;
			}

			case ContextMenuEntry.SendLink: {
				tabs = pipe(
					O.fromNullable(info.pageUrl),
					O.map(url => [{ url, title: url }]),
					O.chain(NEA.fromArray),
				);
				break;
			}
		}

		if (O.isSome(tabs)) {
			cb(tabs.value);
		}
	});

	browser.contextMenus.create({
		id: ContextMenuEntry.SendAllTabs,
		title: 'Send all tabs to Bukubrow',
		contexts: ['page'],
	});

	browser.contextMenus.create({
		id: ContextMenuEntry.SendActiveWindowTabs,
		title: 'Send window tabs to Bukubrow',
		contexts: ['page'],
	});

	browser.contextMenus.create({
		id: ContextMenuEntry.SendActiveTab,
		title: 'Send tab to Bukubrow',
		contexts: ['page'],
	});

	browser.contextMenus.create({
		id: ContextMenuEntry.SendLink,
		title: 'Send link to Bukubrow',
		contexts: ['link'],
	});
};

