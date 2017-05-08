console.log('Content JS loaded.')

// Helper functions
const ensureValidURL = url => {
	const isAlreadyValidUrl = url.substring(0, 7) === 'http://' || url.substring(0, 8) === 'https://'

	return isAlreadyValidUrl ? url : `http://${url}`
}

// Config
const cfg = {
	focusedBookmarkClassName: 'js-focused-bookmark-item'
}

// State of frontend app
let state = {
	bookmarks: [],
	filteredBookmarks: [],
	focusedBookmarkIndex: 0,
	textFilter: ''
}

// Filter bookmarks by text filter on demand
const setFilteredBookmarks = () => {
	state.filteredBookmarks = state.bookmarks.filter(bookmark => {
		return bookmark.Url.toLowerCase().includes(state.textFilter.toLowerCase())
	})
}

// Fetch bookmarks from local storage
const fetchBookmarks = () => {
	return new Promise((resolve, reject) => {
		chrome.storage.local.get('bookmarks', data => {
			state.bookmarks = data.bookmarks || []

			resolve()
		})
	})
}

// Update bookmarks list
const bookmarksEl = document.querySelector('.js-bookmarks')

const displayBookmarks = () => {
	bookmarksEl.innerHTML = ''

	state.filteredBookmarks.forEach((bookmark, index) => {
		const newEl = document.createElement('li')

		newEl.className = 'bookmarks__item'
		if (index === state.focusedBookmarkIndex) {
			newEl.className += ` bookmarks__item--focused ${cfg.focusedBookmarkClassName}`
		}

		const tags = bookmark.Tags.split(',').reduce((acc, tag) => {
			// Split will leave some empty strings behind
			if (!!tag) acc +=`<li class="bookmarks__item-tag">#${tag}</li>`

			return acc
		})

		const desc = bookmark.Desc ? `
			<p class="bookmarks__item-desc">> ${bookmark.Desc}</p>
		` : ''

		newEl.innerHTML = `
			<header>
				<h1 class="bookmarks__item-name">
					${bookmark.Metadata}
				</h1>
				<ul class="bookmarks__item-tags">
					${tags}
				</ul>
			</header>
			${desc}
			<h2 class="bookmarks__item-url">
				${bookmark.Url}
			</h2>
		`

		newEl.addEventListener('click', () => {
			chrome.tabs.create({ url: ensureValidURL(bookmark.Url) })
		})

		bookmarksEl.appendChild(newEl)
	})
}

// Request updated bookmarks
const setBookmarks = () => {
	fetchBookmarks()
		.then(() => {
			setFilteredBookmarks()
			displayBookmarks()
		})
}

const requestBookmarks = () => {
	chrome.runtime.sendMessage({ requestBookmarks: true })
}

const reqEl = document.querySelector('.js-req')

reqEl.addEventListener('click', requestBookmarks)

// React to messages from backend
chrome.runtime.onMessage.addListener(req => {
	if (req.bookmarksUpdated) {
		setBookmarks()
	}
})

// Load bookmarks saved in local storage on load
setBookmarks()

// Update active bookmark focus index on up/down keypress
document.addEventListener('keydown', evt => {
	const keypress = evt.keyCode === 38 ? 'up' : evt.keyCode === 40 ? 'down' : false

	// If keypress not on up or down keys
	if (!keypress) return

	if (keypress === 'up' && state.focusedBookmarkIndex > 0) {
		state.focusedBookmarkIndex--
	} else if (keypress === 'down' && state.focusedBookmarkIndex < state.filteredBookmarks.length - 1) {
		state.focusedBookmarkIndex++
	}

	displayBookmarks()
})

// Search through bookmarks
const searchEl = document.querySelector('.js-search')
const searchInputEl = searchEl.elements['search']

const updateSearchTextFilter = () => {
	state.textFilter = searchInputEl.value
}

searchEl.addEventListener('input', () => {
	state.focusedBookmarkIndex = 0

	updateSearchTextFilter()
	setFilteredBookmarks()
	displayBookmarks()
})

searchEl.addEventListener('submit', evt => {
	evt.preventDefault()

	// Find focused bookmark item
	const focusedBookmarkEl = document.querySelector('.' + cfg.focusedBookmarkClassName)

	if (focusedBookmarkEl) focusedBookmarkEl.click()
	else {
		searchInputEl.value = ''

		updateSearchTextFilter()
		setFilteredBookmarks()
		displayBookmarks()
	}
})
