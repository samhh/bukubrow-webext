console.log('Frontend loaded.')

// Helper functions
ensureValidURL = url => url.substring(0, 6) === 'http://' || url.substring(0, 7) === 'https://' ? url : `http://${url}`

// Fetch bookmarks from local storage
const fetchBookmarks = () => {
	return new Promise((resolve, reject) => {
		chrome.storage.local.get('bookmarks', resolve)
	})
}

// Update bookmarks list
const bookmarksEl = document.querySelector('.js-bookmarks')
const updateBookmarks = bookmarks => {
	bookmarksEl.innerHTML = ''

	bookmarks = bookmarks.bookmarks
	bookmarks.forEach(bookmark => {
		const newEl = document.createElement('li')
		newEl.innerHTML = `
			<span>
				${bookmark.Url}
			</span>
		`
		newEl.addEventListener('click', () => {
			chrome.tabs.create({ url: ensureValidURL(bookmark.Url) })
		})

		bookmarksEl.appendChild(newEl)
	})
}

// Request updated bookmarks
const requestBookmarks = () => {
	chrome.runtime.sendMessage({ requestBookmarks: true })
}

const reqEl = document.querySelector('.js-req')
reqEl.addEventListener('click', requestBookmarks)

// React to messages from backend
chrome.runtime.onMessage.addListener(req => {
	if (req.bookmarksUpdated) fetchBookmarks().then(updateBookmarks)
})

// Load bookmarks saved in local storage on load
fetchBookmarks().then(updateBookmarks)
