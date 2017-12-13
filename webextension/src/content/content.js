import { h, render, Component } from 'preact'
import filterBookmarks from '../modules/filter-bookmarks'
import ensureValidURL from '../modules/ensure-valid-url'
import fullyInViewport from '../modules/element-in-viewport'
import setTheme from '../modules/set-theme'
import sleep from '../modules/sleep'
import { MAX_BOOKMARKS_TO_RENDER } from '../modules/config'

import Bookmark from '../components/bookmark'
import BookmarksForm from '../components/bookmarks-form'
import ErrorPopup from '../components/error-popup'
import Loader from '../components/loader'
import LoadMoreBookmarks from '../components/load-more-bookmarks'
import TutorialMessage from '../components/tutorial-message'

import '../global-styles/'
import './content.css'

class ContentPage extends Component {
	state = {
		errMsg: '',
		loading: true,
		displayTutorialMessage: false,
		bookmarks: [],
		numRemainingBookmarks: 0,
		renderAllBookmarks: false,
		focusedBookmarkIndex: 0,
		textFilter: ''
	}

	numRenderedBookmarks = 0

	static genBookmarkRefSchema = id => `bookmark-${id}`

	constructor () {
		super()

		setTheme()
		chrome.runtime.sendMessage({ checkBinary: true })
		this.checkHasTriggeredRequest()
		this.fetchCachedBookmarks()

		// Respond to messages from the backend
		chrome.runtime.onMessage.addListener(req => {
			if (req.bookmarksUpdated) this.fetchCachedBookmarks()

			if (req.unknownError) {
				const msg = 'An unknown error occurred.'

				this.initError(msg)
			}

			if (req.cannotFindBinary) {
				const msg = 'The binary could not be found. Please refer to the installation instructions.'

				this.initError(msg)
			}

			if (req.outdatedBinary) {
				const msg = 'The binary is outdated; please download or build a more recent one.'

				this.initError(msg)
			}
		})

		// Update active bookmark focus index on up/down keypress
		document.addEventListener('keydown', evt => {
			const keypress = evt.keyCode === 38 ? 'up' : evt.keyCode === 40 ? 'down' : false

			// If keypress not on up or down keys
			if (!keypress) return
			else evt.preventDefault()

			const { focusedBookmarkIndex } = this.state

			if (keypress === 'up' && focusedBookmarkIndex > 0) {
				this.updateFocusedBookmark(focusedBookmarkIndex - 1)
			} else if (keypress === 'down' && focusedBookmarkIndex < this.numRenderedBookmarks - 1) {
				this.updateFocusedBookmark(focusedBookmarkIndex + 1)
			}
		})
	}

	checkHasTriggeredRequest = () => {
		chrome.storage.local.get('hasTriggeredRequest', res => {
			this.setState({
				displayTutorialMessage: !res.hasTriggeredRequest,
				loading: false
			})
		})
	}

	initError = (errMsg, errTimeInSecs = 15) => {
		this.setState({ errMsg })

		sleep(errTimeInSecs * 1000)
			.then(() => {
				this.setState({ errMsg: '' })
			})
	}

	updateFocusedBookmark = index => {
		const indexIncreased = index > this.state.focusedBookmarkIndex

		this.setState({ focusedBookmarkIndex: index }, () => {
			const el = this[ContentPage.genBookmarkRefSchema(index)].base

			const scrollNeeded = !fullyInViewport(el)

			if (!scrollNeeded) return

			const headerHeight = parseInt(window.getComputedStyle(document.body).getPropertyValue('--header-height'), 10)
			const { top, bottom } = el.getBoundingClientRect()

			if (indexIncreased) window.scrollTo(0, window.scrollY + bottom - window.innerHeight)
			else window.scrollTo(0, window.scrollY + top - headerHeight)
		})
	}

	handleTextFilter = evt => {
		this.setState({
			textFilter: evt.target.value,
			renderAllBookmarks: false,
			focusedBookmarkIndex: 0
		})
	}

	setNumBookmarksRemaining = numRemainingBookmarks => {
		this.setState({ numRemainingBookmarks })
	}

	fetchLiveBookmarks = () => new Promise(resolve => {
		chrome.runtime.sendMessage({ requestBookmarks: true })

		this.resolveBookmarksPromise = resolve
	})

	fetchCachedBookmarks = () => {
		chrome.storage.local.get('bookmarks', data => {
			this.setState({ bookmarks: data.bookmarks || [] })

			if (this.resolveBookmarksPromise) {
				this.resolveBookmarksPromise()

				delete this.resolveBookmarksPromise
			}
		})
	}

	renderAllBookmarks = () => {
		this.setState({ renderAllBookmarks: true })
	}

	simulateBookmarkClick = () => {
		if (!this.numRenderedBookmarks) {
			this.setState({
				textFilter: ''
			})

			return
		}

		this[ContentPage.genBookmarkRefSchema(this.state.focusedBookmarkIndex)].base.click()
	}

	openBookmark = url => {
		chrome.tabs.create({ url: ensureValidURL(url) })

		window.close()
	}

	render (props, state) {
		const filteredBookmarks = filterBookmarks(state.bookmarks, state.textFilter)

		const bookmarksToRender =
			state.renderAllBookmarks
				? filteredBookmarks
				: filteredBookmarks.slice(0, MAX_BOOKMARKS_TO_RENDER)

		this.numRenderedBookmarks = bookmarksToRender.length

		const RenderedBookmarks = bookmarksToRender.length
			? bookmarksToRender.map((bookmark, index) => (
				<Bookmark
					title={bookmark.title}
					url={bookmark.url}
					desc={bookmark.desc}
					tags={bookmark.tags}
					textFilter={state.textFilter}
					isFocused={state.focusedBookmarkIndex === index}
					openBookmark={this.openBookmark}
					ref={el => { this[ContentPage.genBookmarkRefSchema(index)] = el }}
				/>
			))
			: null

		const numRemainingBookmarks = filteredBookmarks.length - bookmarksToRender.length
		if (state.numRemainingBookmarks !== numRemainingBookmarks) this.setNumBookmarksRemaining(numRemainingBookmarks)

		const RenderedLoadMoreBookmarks = numRemainingBookmarks ? (
			<LoadMoreBookmarks
				numRemainingBookmarks={numRemainingBookmarks}
				renderAllBookmarks={this.renderAllBookmarks}
			/>
		) : null

		const mainContent = state.displayTutorialMessage ? (
			<TutorialMessage />
		) : (
			<div>
				<ul className="bookmarks">
					{RenderedBookmarks}
				</ul>
				{RenderedLoadMoreBookmarks}
			</div>
		)

		return (
			<div>
				<ErrorPopup msg={state.errMsg} />

				<Loader shouldDisplayLoader={state.loading}>
					<div className="content-wrapper">
						<BookmarksForm
							shouldEnableSearch={!!state.bookmarks.length}
							updateTextFilter={this.handleTextFilter}
							textFilter={this.state.textFilter}
							refreshBookmarks={this.fetchLiveBookmarks}
							triggerBookmarkOpen={this.simulateBookmarkClick}
						/>

						<main className="content">
							{mainContent}
						</main>
					</div>
				</Loader>
			</div>
		)
	}
}

render(<ContentPage />, document.querySelector('.js-root'))
