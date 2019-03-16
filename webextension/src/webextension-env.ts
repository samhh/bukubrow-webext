/* eslint-disable import/no-extraneous-dependencies */

import faker from 'faker';
import sleep from 'Modules/sleep';
import { BOOKMARKS_SCHEMA_VERSION, MINIMUM_BINARY_VERSION } from 'Modules/config';
import { Browser, Tabs } from 'webextension-polyfill-ts';
import { Theme, isTheme } from 'Modules/settings';
import { StorageState } from 'Comms/browser';
import { NativeRequestMethod, NativeRequestData, NativeRequestResult } from 'Comms/native';
import uuid from 'Modules/uuid';
import noop from 'Modules/noop';
import { NonEmptyList } from 'purify-ts/NonEmptyList';

// Allow use of URL params to manipulate state in the simulator
const params = new URLSearchParams(window.location.search);
const [activeThemeParam, latencyParam, numBookmarksToGenerateParam, numStagedGroupsToGenerateParam] =
	[params.get('theme'), Number(params.get('latency')), Number(params.get('numBookmarks')), Number(params.get('numStagedGroups'))];
const activeTheme = isTheme(activeThemeParam)
	? activeThemeParam
	: Theme.Light;
const latency = Number.isNaN(latencyParam) ? 0 : latencyParam;
const numBookmarksToGenerate = Number.isNaN(numBookmarksToGenerateParam) || numBookmarksToGenerateParam === 0
	? Math.round(Math.random() * 1000)
	: numBookmarksToGenerateParam;
const numStagedGroupsToGenerate = Number.isNaN(numStagedGroupsToGenerateParam) || numStagedGroupsToGenerateParam === 0
	? Math.round(Math.random() * 5)
	: numStagedGroupsToGenerateParam;

const genDummyRemoteBookmarks = () => Array(numBookmarksToGenerate)
	.fill(undefined)
	.map((_, i): RemoteBookmark => ({
		id: i,
		metadata: faker.company.companyName(),
		desc: faker.company.bs(),
		url: faker.internet.url(),
		tags: ',' + [...new Set(Array(Math.floor(Math.random() * 5))
			.fill(undefined)
			.map(() => faker.random.word()))].join(',') + ',',
		flags: 0,
	}));

const genDummyStagedGroups = () => Array(numStagedGroupsToGenerate)
	.fill(undefined)
	.map((_, i): StagedBookmarksGroup => ({
		id: i,
		bookmarks: Array(Math.floor(Math.random() * 5))
			.fill(undefined)
			.map(() => ({
				title: faker.company.companyName(),
				desc: '',
				url: faker.internet.url(),
				tags: [],
				flags: 0,
			})),
	}));

let state: StorageState = {
	bookmarks: [],
	stagedBookmarksGroups: genDummyStagedGroups(),
	bookmarksSchemaVersion: BOOKMARKS_SCHEMA_VERSION,
	hasTriggeredRequest: false,
};

let nativeBookmarksState: RemoteBookmark[] = [];

// Note that only the interfaces used by the frontend of the WebExtension needs
// to be mocked
const browserMock: DeepPartial<Browser> = {
	runtime: {
		sendMessage: noop,
		// TODO type this better
		sendNativeMessage: async <T extends NativeRequestMethod>(_appName: string, { method, data }: { method: T; data: NativeRequestData[T] }): Promise<NativeRequestResult[T]> => {
			await sleep(latency);

			switch (method) {
				case NativeRequestMethod.GET: {
					state.hasTriggeredRequest = true;
					if (!NonEmptyList.isNonEmpty(nativeBookmarksState)) nativeBookmarksState = genDummyRemoteBookmarks();

					return Promise.resolve({ success: true, bookmarks: nativeBookmarksState });
				}

				case NativeRequestMethod.OPTIONS: {
					return Promise.resolve({ success: true, binaryVersion: MINIMUM_BINARY_VERSION });
				}

				case NativeRequestMethod.POST: {
					const newBookmark = (data as NativeRequestData[NativeRequestMethod.POST]).bookmark;
					const newId = uuid(nativeBookmarksState.map(bm => bm.id));
					nativeBookmarksState.push({ ...newBookmark, id: newId });

					return Promise.resolve({ success: true, id: newId });
				}

				case NativeRequestMethod.PUT: {
					const updatedBookmark = (data as NativeRequestData[NativeRequestMethod.PUT]).bookmark;
					const indexToUpdate = nativeBookmarksState.findIndex(bm => bm.id === updatedBookmark.id);

					if (indexToUpdate === undefined) return Promise.resolve({ success: false });

					nativeBookmarksState.splice(indexToUpdate, 1, updatedBookmark);

					return Promise.resolve({ success: true });
				}

				case NativeRequestMethod.DELETE: {
					const idToRemove = (data as NativeRequestData[NativeRequestMethod.DELETE]).bookmark_id;
					const indexToRemove = nativeBookmarksState.findIndex(bm => bm.id === idToRemove);

					if (indexToRemove === undefined) return Promise.resolve({ success: false });

					nativeBookmarksState.splice(indexToRemove, 1);

					return Promise.resolve({ success: true });
				}

				// Fallback only due to bad typing TODO
				default: {
					return Promise.resolve({ success: false });
				}
			}
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
		onActivated: {
			addListener: noop,
		},
		onUpdated: {
			addListener: noop,
		},
	},
};

// Mock WebExtension globals
// @ts-ignore
window.browser = browserMock;
// @ts-ignore
window.chrome = browserMock;
