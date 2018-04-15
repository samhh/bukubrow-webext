const setTheme = () => new Promise((resolve) => {
	chrome.storage.sync.get(null, (opts) => {
		const action = opts.theme === 'dark' ? 'add' : 'remove';
		document.body.classList[action]('dark');

		resolve();
	});
});

export default setTheme;
