console.log('Backend loaded.')

// Helper functions
const sortArrOfObjAlphabetically = (bookmarks, sortKey) => {
	return bookmarks.sort((a, b) => {
		return a[sortKey].localeCompare(b[sortKey])
	})
}

const cfg = {
	appName: 'com.samhh.bukubrow'
}

// Save bookmarks to local storage
const saveBookmarks = bookmarks => {
	return new Promise((resolve, reject) => {
		chrome.storage.local.set({
			bookmarks: sortArrOfObjAlphabetically(bookmarks, 'Url'),
			hasTriggeredRequest: true
		}, resolve)
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
