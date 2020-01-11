import { browser, Menus, Tabs } from 'webextension-polyfill-ts';
import { pipe } from 'fp-ts/lib/pipeable';
import { flow } from 'fp-ts/lib/function';
import * as TO from 'fp-ts-contrib/lib/TaskOption';
import * as T from 'fp-ts/lib/Task';
import * as O from 'fp-ts/lib/Option';
import * as OT from '~/modules/optionTuple';
import * as NEA from 'fp-ts/lib/NonEmptyArray';
import * as A from 'fp-ts/lib/Array';
import { getActiveTab, getAllTabs, getActiveWindowTabs, saveStagedBookmarksAsNewGroupToLocalStorage } from '~/modules/comms/browser';
import { values } from '~/modules/record';
import { includes } from '~/modules/array';
import { flip, runTask, runIOs_ } from '~/modules/fp';

const createContextMenuEntry = (x: Menus.CreateCreatePropertiesType): IO<void> => (): void =>
	void browser.contextMenus.create(x);

const isContextMenuEntry: Refinement<unknown, ContextMenuEntry> = (x): x is ContextMenuEntry => pipe(
	values(ContextMenuEntry),
	flip(includes)(x),
);

enum ContextMenuEntry {
	SendAllTabs = 'send_all_tabs_to_bukubrow',
	SendActiveWindowTabs = 'send_active_window_tabs_to_bukubrow',
	SendActiveTab = 'send_active_tab_to_bukubrow',
	SendLink = 'send_link_to_bukubrow',
}

type SufficientTab = Required<Pick<Tabs.Tab, 'title' | 'url'>>;

export const sendTabsToStagingArea = (tabs: NonEmptyArray<SufficientTab>): TaskEither<Error, void> =>
	saveStagedBookmarksAsNewGroupToLocalStorage(NEA.nonEmptyArray.map(tabs, tab => ({
		title: tab.title,
		desc: '',
		url: tab.url,
		tags: [],
		flags: 0,
	})));

const isSufficientTab: Refinement<Tabs.Tab, Tabs.Tab & SufficientTab> = (tab): tab is Tabs.Tab & SufficientTab =>
	!!tab.title && !!tab.url;

const sufficientTabExact: Endomorphism<SufficientTab> = (tab: SufficientTab) =>
	({ title: tab.title, url: tab.url });

const sufficientTabsExact = flow(A.filter(isSufficientTab), A.map(sufficientTabExact));

const createContextMenuListener = <A>(g: (a: A) => void) => (f: (x: Menus.OnClickData) => TaskOption<A>): IO<void> => (): void =>
	browser.contextMenus.onClicked.addListener((x) => {
		runTask(f(x)).then((y) => {
			if (O.isSome(y)) g(y.value);
		});
	});

const contextClickTabs = (u: Option<string>) => (c: ContextMenuEntry): TaskOption<NonEmptyArray<SufficientTab>> => {
	switch (c) {
		case ContextMenuEntry.SendAllTabs: return pipe(
			getAllTabs,
			T.map(flow(O.map(sufficientTabsExact), O.chain(NEA.fromArray))),
		);

		case ContextMenuEntry.SendActiveWindowTabs: return pipe(
			getActiveWindowTabs,
			T.map(flow(O.map(sufficientTabsExact), O.chain(NEA.fromArray))),
		);

		case ContextMenuEntry.SendActiveTab: return pipe(
			getActiveTab,
			T.map(flow(
				O.chain(tab => OT.fromNullable(tab.title, tab.url)),
				O.map(([title, url]) => [{ title, url }]),
				O.chain(NEA.fromArray),
			)),
		);

		case ContextMenuEntry.SendLink: return pipe(
			u,
			O.map(url => [{ url, title: url }]),
			O.chain(NEA.fromArray),
			TO.fromOption,
		);

		default: return TO.none;
	}
};

const handleCtxClick = (x: Menus.OnClickData): TaskOption<NonEmptyArray<SufficientTab>> => pipe(
	x.menuItemId,
	O.fromPredicate(isContextMenuEntry),
	TO.fromOption,
	TO.chain(contextClickTabs(O.fromNullable(x.pageUrl))),
);


/**
 * Initialise context menu items that each obtain various viable window tabs,
 * and pass those onto the callback.
 */
export const initContextMenusAndListen = (cb: (tabs: NonEmptyArray<SufficientTab>) => void): IO<void> => (): void => runIOs_(
	createContextMenuListener(cb)(handleCtxClick),

	createContextMenuEntry({
		id: ContextMenuEntry.SendAllTabs,
		title: 'Send all tabs to Bukubrow',
		contexts: ['page'],
	}),

	createContextMenuEntry({
		id: ContextMenuEntry.SendActiveWindowTabs,
		title: 'Send window tabs to Bukubrow',
		contexts: ['page'],
	}),

	createContextMenuEntry({
		id: ContextMenuEntry.SendActiveTab,
		title: 'Send tab to Bukubrow',
		contexts: ['page'],
	}),

	createContextMenuEntry({
		id: ContextMenuEntry.SendLink,
		title: 'Send link to Bukubrow',
		contexts: ['link'],
	}),
);

