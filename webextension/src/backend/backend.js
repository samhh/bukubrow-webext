import adhereBookmarksToSchema from '../modules/adhere-bookmarks-to-schema'
import { saveBookmarks } from './local-storage'

console.log('Backend loaded.')

const cfg = {
	appName: 'com.samhh.bukubrow'
}

// Tell frontend that updated bookmarks are available from local storage
const sendBookmarksNotif = () => {
	chrome.runtime.sendMessage({ bookmarksUpdated: true })
}

// Request bookmarks
const requestBookmarks = () => {
	console.log('Bookmarks requested...')

	chrome.runtime.sendNativeMessage(cfg.appName, { method: 'GET' }, res => {
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

		if (!res.success) return

		const bookmarks = adhereBookmarksToSchema(res.bookmarks)
		saveBookmarks(bookmarks).then(sendBookmarksNotif)
	})
}

chrome.runtime.onMessage.addListener(req => {
	if (req.requestBookmarks) requestBookmarks()
})
