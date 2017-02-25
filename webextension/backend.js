console.log('Backend loaded.')

const cfg = {
	appName: 'com.samhh.bukubrow',
	timerIntervalInSecs: 5
}

// Save bookmarks to local storage
const saveBookmarks = bookmarks => {
	return new Promise((resolve, reject) => {
		chrome.storage.local.set({ bookmarks }, resolve)
	})
}

// Tell frontend that updated bookmarks are available from local storage
const sendBookmarksNotif = () => {
	chrome.runtime.sendMessage({ bookmarksUpdated: true })
}

// Request bookmarks
const requestBookmarks = () => {
	console.log('Bookmarks requested...')

	chrome.runtime.sendNativeMessage(cfg.appName, { request: 'true' }, res => {
		if (chrome.runtime.lastError) return console.log(chrome.runtime.lastError)

		console.log('...bookmarks fetched and returned.')

		saveBookmarks(res).then(sendBookmarksNotif)
	})
}

chrome.runtime.onMessage.addListener(req => {
	if (req.requestBookmarks) requestBookmarks()
})
