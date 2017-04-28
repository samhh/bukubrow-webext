console.log('Shared JS loaded.')

window.setTheme = () => {
	chrome.storage.sync.get(null, opts => {
		const action = opts.theme === 'dark' ? 'add' : 'remove'

		document.body.classList[action]('dark')
	})
}

// Load theme on load
setTheme()
