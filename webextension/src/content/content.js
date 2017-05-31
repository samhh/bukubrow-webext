import setTheme from '../modules/setTheme'
import ensureValidURL from '../modules/ensureValidURL'
import sleep from '../modules/sleep'

import '../global-styles/'
import './content.css'

console.log('Content JS loaded.')

// Config
const cfg = {
	focusedBookmarkClassName: 'js-focused-bookmark-item',
	maxBookmarksToRender: 10
}

// State of frontend app
let state = {
	bookmarks: [],
	filteredBookmarks: [],
	numRenderedBookmarks: 0,
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

const renderBookmarks = (renderAll = false) => {
	if (renderAll) state.numRenderedBookmarks = state.filteredBookmarks.length
	state.numRenderedBookmarks = renderAll
		? state.filteredBookmarks.length
		: Math.min(state.filteredBookmarks.length, cfg.maxBookmarksToRender)

	const newWrapper = document.createElement('ul')
	newWrapper.className = 'bookmarks'

	bookmarksEl.innerHTML = ''
	bookmarksEl.appendChild(newWrapper)

	const { filteredBookmarks: bookmarks } = state

	for (let i = 0; i < bookmarks.length; i++) {
		const newEl = document.createElement('li')

		newEl.className = 'bookmarks__item'
		if (i === state.focusedBookmarkIndex) {
			newEl.className += ` bookmarks__item--focused ${cfg.focusedBookmarkClassName}`
		}

		const tags = bookmarks[i].Tags.split(',').reduce((acc, tag) => {
			// Split will leave some empty strings behind
			if (tag) acc += `<li class="bookmarks__item-tag">#${addHighlightMarkup(tag)}</li>`

			return acc
		})

		const desc = bookmarks[i].Desc ? `
			<p class="bookmarks__item-desc">> ${addHighlightMarkup(bookmarks[i].Desc)}</p>
		` : ''

		newEl.innerHTML = `
			<header>
				<h1 class="bookmarks__item-name">
					${addHighlightMarkup(bookmarks[i].Metadata)}
				</h1>
				<ul class="bookmarks__item-tags">
					${tags}
				</ul>
			</header>
			${desc}
			<h2 class="bookmarks__item-url">
				${addHighlightMarkup(bookmarks[i].Url)}
			</h2>
		`

		// On click open the link in a new tab and close the extension popup
		newEl.addEventListener('click', () => {
			chrome.tabs.create({ url: ensureValidURL(bookmarks[i].Url) })

			window.close()
		})

		newWrapper.appendChild(newEl)

		if (!renderAll && i >= cfg.maxBookmarksToRender - 1) {
			if (state.filteredBookmarks.length > cfg.maxBookmarksToRender) {
				const remainingBookmarks = bookmarks.length - cfg.maxBookmarksToRender
				const nthMoreEl = document.createElement('p')

				nthMoreEl.className = 'bookmarks__more-note'
				nthMoreEl.textContent = `...and ${remainingBookmarks} more.`

				nthMoreEl.addEventListener('click', () => renderBookmarks(true))

				newWrapper.appendChild(nthMoreEl)
			}

			break
		}
	}
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

	sleep(timeInSecs * 1000).then(() => {
		errorEl.classList.remove(visibleClassName)
	})
}

const searchEl = document.querySelector('.js-search')
const searchInputEl = searchEl.elements['search']

checkHasTriggeredRequest()
	.then(hasTriggeredRequest => {
		if (!hasTriggeredRequest) renderTutorialMessage()
	})

const reqEl = document.querySelector('.js-req')
const reqActiveClassName = 'controls__refresh--active'

// Request updated bookmarks
const setBookmarks = () => {
	fetchBookmarks()
		.then(areAnyBookmarks => {
			// Remove the active class once the animation has finished its current
			// iteration
			const animationEl = reqEl.querySelector('svg')
			const removeActiveClass = () => {
				reqEl.classList.remove(reqActiveClassName)

				animationEl.removeEventListener('animationiteration', removeActiveClass)
			}

			animationEl.addEventListener('animationiteration', removeActiveClass)

			if (areAnyBookmarks) {
				searchInputEl.disabled = false

				// Firefox refuses to focus unless you wait a seemingly arbitrary length
				// of time
				sleep(150).then(() => {
					searchInputEl.focus()
				})

				setFilteredBookmarks()
				renderBookmarks()
			} else {
				searchInputEl.disabled = true
			}
		})
}

const requestBookmarks = () => {
	reqEl.classList.add(reqActiveClassName)

	chrome.runtime.sendMessage({ requestBookmarks: true })
}

reqEl.addEventListener('click', requestBookmarks)

// React to messages from backend
chrome.runtime.onMessage.addListener(req => {
	if (req.bookmarksUpdated) setBookmarks()

	if (req.cannotFindBinary) {
		const msg = 'The binary could not be found. Please refer to the installation instructions.'

		renderErrorMsg(msg)
	}

	if (req.unknownError) {
		const msg = 'An unknown error occurred.'

		renderErrorMsg(msg)
	}
})

// Load theme and bookmarks saved in local storage on load
setTheme()
setBookmarks()

// Update active bookmark focus index on up/down keypress
document.addEventListener('keydown', evt => {
	const keypress = evt.keyCode === 38 ? 'up' : evt.keyCode === 40 ? 'down' : false

	// If keypress not on up or down keys
	if (!keypress) return
	else evt.preventDefault()

	if (keypress === 'up' && state.focusedBookmarkIndex > 0) {
		state.focusedBookmarkIndex--
	} else if (keypress === 'down' && state.focusedBookmarkIndex < state.numRenderedBookmarks - 1) {
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
