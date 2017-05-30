import sortArrOfObjAlphabetically from '../modules/sortArrOfObjAlphabetically'

console.log('Backend loaded.')

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
		if (chrome.runtime.lastError) {
			const error = chrome.runtime.lastError.message

			console.log(`...error fetching bookmarks: ${error}`)

			if (error === 'Specified native messaging host not found.') {
				chrome.runtime.sendMessage({ cannotFindBinary: true })
			} else {
				chrome.runtime.sendMessage({ unknownError: true })
			}

			return
		}

		console.log('...bookmarks fetched and returned.')

		saveBookmarks(res).then(sendBookmarksNotif)
	})
}

chrome.runtime.onMessage.addListener(req => {
	if (req.requestBookmarks) requestBookmarks()
})
