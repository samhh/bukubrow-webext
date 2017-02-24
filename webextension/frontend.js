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

// Update timer
const timerEl = document.querySelector('.js-timer')
const updateTimer = time => { timerEl.textContent = String(time) }

// React to messages from backend
chrome.runtime.onMessage.addListener(req => {
	if (req.bookmarks) updateBookmarks(req.bookmarks)
	if (req.timer) updateTimer(req.timer)

	if (!req.bookmarks && !req.timer) console.log(`Unknown frontend message received: ${req}`)
})
