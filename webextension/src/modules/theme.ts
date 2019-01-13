export enum Theme {
	Light = 'light',
	Dark = 'dark',
}

export const getActiveTheme = () => new Promise<Theme>((resolve) => {
	chrome.storage.sync.get(null, (opts) => {
		const { theme } = opts as { theme?: Theme };

		resolve(theme || Theme.Light);
	});
});

export const setTheme = (theme: Theme) => {
	const action = theme === 'dark'
		? 'add'
		: 'remove';

	document.body.classList[action]('dark');
};
