console.log('Shared JS loaded.')

window.setTheme = () => {
	chrome.storage.sync.get(null, opts => {
		if (opts.theme === 'dark') document.body.classList.add('dark')
		else document.body.classList.remove('dark')
	})
}

// Load theme on load
setTheme()
