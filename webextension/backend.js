console.log('Backend loaded.')

const cfg = {
	appName: 'com.samhh.bukubrow',
	timerIntervalInSecs: 5
}

// Request bookmarks
const requestBookmarks = () => {
	console.log('Bookmarks requested...')

	chrome.runtime.sendNativeMessage(cfg.appName, { request: 'true' }, res => {
		if (chrome.runtime.lastError) console.log(chrome.runtime.lastError)
		else console.log('...bookmarks fetched and returned.')

		chrome.runtime.sendMessage({ bookmarks: res })
	})
}

chrome.runtime.onMessage.addListener(req => {
	if (req.requestBookmarks) requestBookmarks()
})
