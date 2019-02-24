/* eslint-disable import/no-extraneous-dependencies */

import faker from 'faker';
import sleep from 'Modules/sleep';
import { BOOKMARKS_SCHEMA_VERSION } from 'Modules/config';
import { Browser, Tabs } from 'webextension-polyfill-ts';
import { Theme, isTheme } from 'Modules/settings';
import { StorageState } from 'Modules/cache';
import { BackendRequest, BackendResponse } from 'Comms/shared';

// Allow use of URL params to manipulate state in the simulator
const params = new URLSearchParams(window.location.search);
const [activeThemeParam, numBookmarksToGenerateParam] = [params.get('theme'), Number(params.get('numBookmarks'))];
const activeTheme = isTheme(activeThemeParam)
	? activeThemeParam
	: Theme.Light;
const numBookmarksToGenerate = Number.isNaN(numBookmarksToGenerateParam) || numBookmarksToGenerateParam === 0
	? Math.round(Math.random() * 1000)
	: numBookmarksToGenerateParam;

const genDummyBookmarks = () => Array(numBookmarksToGenerate)
	.fill(undefined)
	.map((_, i): LocalBookmark => ({
		id: i,
		title: faker.company.companyName(),
		desc: faker.company.bs(),
		url: faker.internet.url(),
		tags: [...new Set(Array(Math.floor(Math.random() * 5))
			.fill(undefined)
			.map(() => faker.random.word()))],
		flags: 0,
	}));

let state: StorageState = {
	bookmarks: [],
	bookmarksSchemaVersion: BOOKMARKS_SCHEMA_VERSION,
	hasTriggeredRequest: false,
};

type Listener = (res: BackendResponse) => void;
let listenerCb: Listener = () => {
	throw new Error('No custom listener callback registered.');
};

// Note that only the frontend of the WebExtension needs to be mocked
const browserMock: DeepPartial<Browser> = {
	runtime: {
		onMessage: {
			addListener: (cb: Listener) => {
				listenerCb = cb;
			},
		},
		sendMessage: (req: BackendRequest) => {
			if ('requestBookmarks' in req) {
				sleep(200).then(() => {
					if (!state.hasTriggeredRequest) {
						state.hasTriggeredRequest = true;
						state.bookmarks = genDummyBookmarks();
					}

					listenerCb({ bookmarksUpdated: true });
				});
			}

			if ('saveBookmark' in req) {
				sleep(50).then(() => {
					state.bookmarks.push({ ...req.bookmark, id: state.bookmarks[state.bookmarks.length - 1].id + 1 });

					listenerCb({ bookmarkSaved: true });
				});
			}

			if ('updateBookmark' in req) {
				sleep(50).then(() => {
					for (let i = 0; i < state.bookmarks.length; i++) {
						if (state.bookmarks[i].id === req.bookmark.id) {
							state.bookmarks.splice(i, 1, req.bookmark);

							break;
						}
					}

					listenerCb({ bookmarkUpdated: true });
				});
			}

			if ('deleteBookmark' in req) {
				sleep(50).then(() => {
					for (let i = 0; i < state.bookmarks.length; i++) {
						if (state.bookmarks[i].id === req.bookmarkId) {
							state.bookmarks.splice(i, 1);

							break;
						}
					}

					listenerCb({ bookmarkDeleted: true });
				});
			}

			return Promise.resolve();
		},
	},
	storage: {
		local: {
			get: () => Promise.resolve(state),
			set: (partialState: StorageState) => {
				state = { ...state, ...partialState };

				return Promise.resolve();
			},
		},
		sync: {
			get: () => Promise.resolve({ theme: activeTheme }),
		},
	},
	tabs: {
		query: () => Promise.resolve([{ title: 'Currently Active Tab Page Title', url: 'https://samhh.com' }] as Tabs.Tab[]),
		create: () => Promise.resolve(),
	},
};

// Mock WebExtension globals
// @ts-ignore
window.browser = browserMock;
// @ts-ignore
window.chrome = browserMock;
