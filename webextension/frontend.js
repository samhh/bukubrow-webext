console.log('Frontend loaded.')

// Helper functions
ensureValidURL = url => url.substring(0, 6) === 'http://' || url.substring(0, 7) === 'https://' ? url : `http://${url}`

// State of frontend app
let state = {
	bookmarks: [],
	textFilter: []
}

// Filter bookmarks by text filter on demand
const getFilteredBookmarks = () => state.bookmarks.filter(bookmark => bookmark.Url.includes(state.textFilter))

// Fetch bookmarks from local storage
const fetchBookmarks = () => {
	return new Promise((resolve, reject) => {
		chrome.storage.local.get('bookmarks', data => {
			state.bookmarks = data.bookmarks

			resolve()
		})
	})
}

// Update bookmarks list
const bookmarksEl = document.querySelector('.js-bookmarks')
const displayBookmarks = () => {
	bookmarksEl.innerHTML = ''

	getFilteredBookmarks().forEach(bookmark => {
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

const updateBookmarks = () => {
	fetchBookmarks().then(displayBookmarks)
}

// Request updated bookmarks
const requestBookmarks = () => {
	chrome.runtime.sendMessage({ requestBookmarks: true })
}

const reqEl = document.querySelector('.js-req')
reqEl.addEventListener('click', requestBookmarks)

// React to messages from backend
chrome.runtime.onMessage.addListener(req => {
	if (req.bookmarksUpdated) updateBookmarks()
})

// Load bookmarks saved in local storage on load
updateBookmarks()

// Search through bookmarks
const searchEl = document.querySelector('.js-search')
searchEl.addEventListener('input', () => {
	state.textFilter = searchEl.value

	displayBookmarks()
})
