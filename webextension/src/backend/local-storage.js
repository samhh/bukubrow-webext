import sortArrOfObjAlphabetically from '../modules/sort-arr-of-obj-alphabetically'

// Save bookmarks to local storage
export const saveBookmarks = bookmarks => {
	return new Promise((resolve, reject) => {
		chrome.storage.local.set({
			bookmarks: sortArrOfObjAlphabetically(bookmarks, 'title'),
			hasTriggeredRequest: true
		}, resolve)
	})
}
