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
		time: new Date().getTime() - (Math.random() * 1000000000),
		bookmarks: Array(Math.ceil(Math.random() * 5))
			.fill(undefined)
			.map((_, i) => ({
				id: i,
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
};

let nativeBookmarksState: RemoteBookmark[] = [];

// Note that only the interfaces used by the frontend of the WebExtension needs
// to be mocked
const browserMock: DeepPartial<Browser> = {
	runtime: {
		sendMessage: noop,
		sendNativeMessage: async <T extends NativeRequestMethod>(
			_appName: string,
			{ method, data }: { method: T; data: NativeRequestData[T] },
		): Promise<NativeRequestResult[T]> => {
			await sleep(latency);

			// This assertion may not be needed once the following is merged:
			// https://github.com/Microsoft/TypeScript/pull/22348
			switch (method as NativeRequestMethod) {
				case NativeRequestMethod.GET: {
					if (!NonEmptyList.isNonEmpty(nativeBookmarksState)) nativeBookmarksState = genDummyRemoteBookmarks();

					return Promise.resolve({ success: true, bookmarks: nativeBookmarksState });
				}

				case NativeRequestMethod.OPTIONS: {
					return Promise.resolve({ success: true, binaryVersion: MINIMUM_BINARY_VERSION });
				}

				case NativeRequestMethod.POST: {
					const newBookmarks = (data as NativeRequestData[NativeRequestMethod.POST]).bookmarks;
					const newId = uuid(nativeBookmarksState.map(bm => bm.id));

					for (const newBookmark of newBookmarks) {
						nativeBookmarksState.push({ ...newBookmark, id: newId });
					}

					return Promise.resolve({ success: true, id: newId });
				}

				case NativeRequestMethod.PUT: {
					const updatedBookmarks = (data as NativeRequestData[NativeRequestMethod.PUT]).bookmarks;

					for (const updatedBookmark of updatedBookmarks) {
						const indexToUpdate = nativeBookmarksState.findIndex(bm => bm.id === updatedBookmark.id);
						if (indexToUpdate === undefined) return Promise.resolve({ success: false });

						nativeBookmarksState.splice(indexToUpdate, 1, updatedBookmark);
					}

					return Promise.resolve({ success: true });
				}

				case NativeRequestMethod.DELETE: {
					const idsToRemove = (data as NativeRequestData[NativeRequestMethod.DELETE]).bookmark_ids;

					for (const idToRemove of idsToRemove) {
						const indexToRemove = nativeBookmarksState.findIndex(bm => bm.id === idToRemove);

						if (indexToRemove === undefined) return Promise.resolve({ success: false });

						nativeBookmarksState.splice(indexToRemove, 1);
					}

					return Promise.resolve({ success: true });
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
