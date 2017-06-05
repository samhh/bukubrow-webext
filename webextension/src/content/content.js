import { h, render, Component } from 'preact'
import filterBookmarks from '../modules/filter-bookmarks'
import ensureValidURL from '../modules/ensure-valid-url'
import setTheme from '../modules/set-theme'
import sleep from '../modules/sleep'
import { maxBookmarksToRender } from '../modules/config'

import Bookmark from '../components/bookmark'
import BookmarksForm from '../components/bookmarks-form'
import ErrorPopup from '../components/error-popup'
import Loader from '../components/loader'
import LoadMoreBookmarks from '../components/load-more-bookmarks'
import TutorialMessage from '../components/tutorial-message'

import '../global-styles/'
import './content.css'

console.log('Content JS loaded.')

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

	constructor () {
		super()

		setTheme()
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
		})

		// Update active bookmark focus index on up/down keypress
		document.addEventListener('keydown', evt => {
			const keypress = evt.keyCode === 38 ? 'up' : evt.keyCode === 40 ? 'down' : false

			// If keypress not on up or down keys
			if (!keypress) return
			else evt.preventDefault()

			const { focusedBookmarkIndex } = this.state

			if (keypress === 'up' && focusedBookmarkIndex > 0) {
				this.setState({
					focusedBookmarkIndex: focusedBookmarkIndex - 1
				})
			} else if (keypress === 'down' && focusedBookmarkIndex < this.numRenderedBookmarks - 1) {
				this.setState({
					focusedBookmarkIndex: focusedBookmarkIndex + 1
				})
			}
		})
	}

	genBookmarkRefSchema = id => `bookmark-${id}`

	checkHasTriggeredRequest = () => {
		chrome.storage.local.get('hasTriggeredRequest', res => {
			this.setState({
				displayTutorialMessage: !res.hasTriggeredRequest,
				loading: false
			})
		})
	}

	initError = (errMsg, errTimeInSecs = 5) => {
		this.setState({ errMsg })

		sleep(errTimeInSecs * 1000)
			.then(() => {
				this.setState({ errMsg: '' })
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

		this[this.genBookmarkRefSchema(this.state.focusedBookmarkIndex)].base.click()
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
				: filteredBookmarks.slice(0, maxBookmarksToRender)

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
					ref={el => { this[this.genBookmarkRefSchema(index)] = el }}
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
					<BookmarksForm
						shouldEnableSearch={!!state.bookmarks.length}
						updateTextFilter={this.handleTextFilter}
						textFilter={this.state.textFilter}
						refreshBookmarks={this.fetchLiveBookmarks}
						triggerBookmarkOpen={this.simulateBookmarkClick}
					/>
					<main>
						{mainContent}
					</main>
				</Loader>
			</div>
		)
	}
}

render(<ContentPage />, document.querySelector('.js-root'))