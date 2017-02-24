console.log('Backend loaded.')

const cfg = {
	appName: 'com.samhh.bukubrow',
	timerIntervalInSecs: 5
}

// Request bookmarks
const requestBookmarks = () => {
	console.log('Requesting bookmarks...')

	chrome.runtime.sendNativeMessage(cfg.appName, { request: 'true' }, res => {
		if (chrome.runtime.lastError) console.log(chrome.runtime.lastError)

		console.dir('Received from binary: ' + res)
		res.forEach(obj => console.dir(obj))
		chrome.runtime.sendMessage({ bookmarks: res })
	})
}

// Timer to check when to fetch new bookmarks
let timer = cfg.timerIntervalInSecs

setInterval(() => {
	timer--

	if (timer === 0) {
		timer = cfg.timerIntervalInSecs

		requestBookmarks()
	}

	// Update frontend timer
	chrome.runtime.sendMessage({ timer })
}, 1000)
