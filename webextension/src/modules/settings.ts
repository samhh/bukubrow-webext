export enum Theme {
	Light = 'light',
	Dark = 'dark',
}

export interface Settings {
	theme: Theme;
}

export const saveSettings = (opts: Partial<Settings>): Promise<void> =>
	new Promise((resolve) => {
		chrome.storage.sync.set(opts, resolve);
	});

export const getSettings = (): Promise<Partial<Settings>> =>
	new Promise((resolve) => {
		chrome.storage.sync.get(null, (data) => {
			resolve(data as Partial<Settings>);
		});
	});
