import adhereBookmarksToSchema from '../modules/adhere-bookmarks-to-schema'
import { sendExtensionMessage } from './api/protocol'
import { saveBookmarks } from './local-storage'
import { checkRuntimeErrors, checkBinaryVersion, getBookmarks } from './api/native'

const checkBinary = () => {
	const errors = checkRuntimeErrors()
	const version = checkBinaryVersion()

	return Promise.all([errors, version])
		.then(([err, versionIsOkay]) => {
			if (err) {
				err === 'Specified native messaging host not found.'
					? sendExtensionMessage({ cannotFindBinary: true })
					: sendExtensionMessage({ unknownError: true })

				return false
			}

			if (!versionIsOkay) {
				sendExtensionMessage({ outdatedBinary: true })

				return false
			}

			return true
		})
}

// Request bookmarks
const requestBookmarks = () =>
	getBookmarks()
		.then(res => {
			if (!res || !res.success) return false

			const bookmarks = adhereBookmarksToSchema(res.bookmarks)

			return saveBookmarks(bookmarks).then(() => {
				sendExtensionMessage({ bookmarksUpdated: true })

				return true
			})
		})

// Listen for messages from frontend
chrome.runtime.onMessage.addListener(req => {
	if (req.checkBinary) checkBinary()
	if (req.requestBookmarks) requestBookmarks()
})
