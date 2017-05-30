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

// Check if the user has ever triggered a request
// If not, display tutorial message
const checkHasTriggeredRequest = () => {
	return new Promise((resolve, reject) => {
		chrome.storage.local.get('hasTriggeredRequest', res => {
			resolve(!!res.hasTriggeredRequest)
		})
	})
}

// Filter bookmarks by text filter on demand
const setFilteredBookmarks = () => {
	const textFilter = state.textFilter.toLowerCase()

	// Using separate arrays is an easy way to sort matches
	const nameMatches = []
	const tagMatches = []
	const urlMatches = []
	const descMatches = []

	state.bookmarks.forEach(bookmark => {
		if (bookmark.Metadata.toLowerCase().includes(textFilter)) nameMatches.push(bookmark)
		else if (bookmark.Tags.toLowerCase().includes(textFilter)) tagMatches.push(bookmark)
		else if (bookmark.Url.toLowerCase().includes(textFilter)) urlMatches.push(bookmark)
		else if (bookmark.Desc.toLowerCase().includes(textFilter)) descMatches.push(bookmark)
	})

	state.filteredBookmarks = [...nameMatches, ...tagMatches, ...urlMatches, ...descMatches]
}

// Fetch bookmarks from local storage
const fetchBookmarks = () => {
	return new Promise((resolve, reject) => {
		chrome.storage.local.get('bookmarks', data => {
			state.bookmarks = data.bookmarks

			resolve(!!data.bookmarks)
		})
	})
}

const addHighlightMarkup = str => {
	// Doing it this way enables us to search case insensitively using a variable
	const findRe = new RegExp(state.textFilter, 'ig')

	return str.replace(findRe, `<span class="highlighted-text">${state.textFilter}</span>`)
}

// Update bookmarks list
const bookmarksEl = document.querySelector('.js-bookmarks')

const renderBookmarks = () => {
	const newWrapper = document.createElement('ul')
	newWrapper.className = 'bookmarks'

	bookmarksEl.innerHTML = ''
	bookmarksEl.appendChild(newWrapper)

	state.filteredBookmarks.forEach((bookmark, index) => {
		const newEl = document.createElement('li')

		newEl.className = 'bookmarks__item'
		if (index === state.focusedBookmarkIndex) {
			newEl.className += ` bookmarks__item--focused ${cfg.focusedBookmarkClassName}`
		}

		const tags = bookmark.Tags.split(',').reduce((acc, tag) => {
			// Split will leave some empty strings behind
			if (!!tag) acc +=`<li class="bookmarks__item-tag">#${addHighlightMarkup(tag)}</li>`

			return acc
		})

		const desc = bookmark.Desc ? `
			<p class="bookmarks__item-desc">> ${addHighlightMarkup(bookmark.Desc)}</p>
		` : ''

		newEl.innerHTML = `
			<header>
				<h1 class="bookmarks__item-name">
					${addHighlightMarkup(bookmark.Metadata)}
				</h1>
				<ul class="bookmarks__item-tags">
					${tags}
				</ul>
			</header>
			${desc}
			<h2 class="bookmarks__item-url">
				${addHighlightMarkup(bookmark.Url)}
			</h2>
		`

		newEl.addEventListener('click', () => {
			chrome.tabs.create({ url: ensureValidURL(bookmark.Url) })
		})

		newWrapper.appendChild(newEl)
	})
}

// Render tutorial message instead of bookmarks list
const renderTutorialMessage = () => {
	bookmarksEl.innerHTML = `
		<p class="tutorial-msg">
			To fetch your bookmarks for use in Bukubrow click the button with the arrow in it above.<br><br>Do this whenever you want to refresh your local cache of bookmarks with those from Buku.
		</p>
	`
}

// Render error messages for specified time
const errorEl = document.querySelector('.js-error')
const renderErrorMsg = (msg, timeInSecs = 5) => {
	const visibleClassName = 'visible'

	errorEl.textContent = msg
	errorEl.classList.add(visibleClassName)

	setTimeout(() => {
		errorEl.classList.remove(visibleClassName)
	}, timeInSecs * 1000)
}

const searchEl = document.querySelector('.js-search')
const searchInputEl = searchEl.elements['search']

checkHasTriggeredRequest()
	.then(hasTriggeredRequest => {
		if (!hasTriggeredRequest) renderTutorialMessage()
	})

// Request updated bookmarks
const setBookmarks = () => {
	fetchBookmarks()
		.then(areAnyBookmarks => {
			if (areAnyBookmarks) {
				searchInputEl.disabled = false

				setFilteredBookmarks()
				renderBookmarks()
			} else {
				searchInputEl.disabled = true
			}
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

	if (req.cannotFindBinary) {
		const msg = 'The binary could not be found. Please refer to the installation instructions.'

		renderErrorMsg(msg)
	}

	if (req.unknownError) {
		const msg = 'An unknown error occurred.'

		renderErrorMsg(msg)
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

	renderBookmarks()
})

// Search through bookmarks
const updateSearchTextFilter = () => {
	state.textFilter = searchInputEl.value
}

searchEl.addEventListener('input', () => {
	state.focusedBookmarkIndex = 0

	updateSearchTextFilter()
	setFilteredBookmarks()
	renderBookmarks()
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
		renderBookmarks()
	}
})
