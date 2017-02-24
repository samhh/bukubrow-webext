console.log('Frontend loaded.')

// Helper functions
ensureValidURL = url => url.substring(0, 6) === 'http://' || url.substring(0, 7) === 'https://' ? url : `http://${url}`

// Update bookmarks list
const bookmarksEl = document.querySelector('.js-bookmarks')
const updateBookmarks = bookmarks => {
	bookmarksEl.innerHTML = ''

	bookmarks.forEach(bookmark => {
		const newEl = document.createElement('li')
		newEl.innerHTML = `
			<li>
				${bookmark.Url}
			</li>
		`
		newEl.addEventListener('click', () => {
			chrome.tabs.create({ url: ensureValidURL(bookmark.Url) })
		})

		bookmarksEl.appendChild(newEl)
	})
}

// Request fresh bookmarks
const requestBookmarks = () => {
	chrome.runtime.sendMessage({ requestBookmarks: true })
}

const reqEl = document.querySelector('.js-req')
reqEl.addEventListener('click', requestBookmarks)

// React to messages from backend
chrome.runtime.onMessage.addListener(req => {
	if (req.bookmarks) updateBookmarks(req.bookmarks)
})
