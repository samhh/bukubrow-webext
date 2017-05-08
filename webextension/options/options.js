console.log('Options JS loaded.')

const cfg = {
	defaultTheme: 'light'
}

const formEl = document.querySelector('.js-form')
const noticeEl = document.querySelector('.js-notice')

const saveOpts = opts => {
	return new Promise((resolve, reject) => {
		chrome.storage.sync.set(opts, resolve)
	})
}

const restoreOpts = () => {
	return new Promise((resolve, reject) => {
		chrome.storage.sync.get(null, resolve)
	})
}

const setOptsState = async (opts) => {
	if (!opts) opts = await restoreOpts()

	formEl.elements['theme'].value = opts.theme || cfg.defaultTheme
}

setOptsState()

formEl.addEventListener('submit', e => {
	e.preventDefault()

	let selectedOpts = {
		theme: formEl.elements['theme'].value
	}

	saveOpts(selectedOpts).then(() => {
		window.setTheme()

		noticeEl.innerHTML = 'Settings saved successfully.'
	})
})
