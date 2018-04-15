import React, { Component, createRef, FormEvent, RefObject } from 'react';
import { render } from 'react-dom';
import filterBookmarks from 'Modules/filter-bookmarks';
import ensureValidURL from 'Modules/ensure-valid-url';
import fullyInViewport from 'Modules/element-in-viewport';
import setTheme from 'Modules/set-theme';
import sleep from 'Modules/sleep';
import { MAX_BOOKMARKS_TO_RENDER } from 'Modules/config';

import Bookmark, { ForwardRefElementType } from 'Components/bookmark';
import BookmarksForm from 'Components/bookmarks-form';
import ErrorPopup from 'Components/error-popup';
import Loader from 'Components/loader';
import LoadMoreBookmarks from 'Components/load-more-bookmarks';
import TutorialMessage from 'Components/tutorial-message';

import '../global-styles/';
import './content.css';

interface Props {}

interface State {
	errMsg: string;
	loading: boolean;
	displayTutorialMessage: boolean;
	bookmarks: LocalBookmark[];
	numRemainingBookmarks: number;
	renderAllBookmarks: boolean;
	focusedBookmarkIndex: number;
	textFilter: string;
}

class ContentPage extends Component<Props, State> {
	state = {
		errMsg: '',
		loading: true,
		displayTutorialMessage: false,
		bookmarks: [],
		numRemainingBookmarks: 0,
		renderAllBookmarks: false,
		focusedBookmarkIndex: 0,
		textFilter: '',
	};

	bookmarkRefs: Map<number, RefObject<JSX.Element | {}>> = new Map();
	numRenderedBookmarks = 0;
	resolveBookmarksPromise: Function | undefined;

	constructor (props: Props) {
		super(props);

		setTheme();
		chrome.runtime.sendMessage({ checkBinary: true });
		this.checkHasTriggeredRequest();
		this.fetchCachedBookmarks();

		// Respond to messages from the backend
		chrome.runtime.onMessage.addListener((req) => {
			if (req.bookmarksUpdated) this.fetchCachedBookmarks();

			if (req.unknownError) {
				const msg = 'An unknown error occurred.';

				this.initError(msg);
			}

			if (req.cannotFindBinary) {
				const msg = 'The binary could not be found. Please refer to the installation instructions.';

				this.initError(msg);
			}

			if (req.outdatedBinary) {
				const msg = 'The binary is outdated; please download or build a more recent one.';

				this.initError(msg);
			}
		});

		// Update active bookmark focus index on up/down keypress
		document.addEventListener('keydown', (evt: KeyboardEvent) => {
			const keypress = evt.keyCode === 38
				? 'up'
				: evt.keyCode === 40
					? 'down'
					: false;

			// If keypress not on up or down keys
			if (!keypress) return;

			evt.preventDefault();

			const { focusedBookmarkIndex } = this.state;

			if (keypress === 'up' && focusedBookmarkIndex > 0) {
				this.updateFocusedBookmark(focusedBookmarkIndex - 1);
			} else if (keypress === 'down' && focusedBookmarkIndex < this.numRenderedBookmarks - 1) {
				this.updateFocusedBookmark(focusedBookmarkIndex + 1);
			}
		});
	}

	checkHasTriggeredRequest = () => {
		chrome.storage.local.get('hasTriggeredRequest', (res) => {
			this.setState({
				displayTutorialMessage: !res.hasTriggeredRequest,
				loading: false,
			});
		});
	}

	initError = (errMsg: string, errTimeInSecs: number = 15): void => {
		this.setState({ errMsg });

		sleep(errTimeInSecs * 1000)
			.then(() => {
				this.setState({ errMsg: '' });
			});
	}

	updateFocusedBookmark = (index: number) => {
		const indexIncreased = index > this.state.focusedBookmarkIndex;

		this.setState({ focusedBookmarkIndex: index }, () => {
			const ref = this.bookmarkRefs.get(index);

			if (!ref) return;

			const el = ref.current as HTMLElement;

			const scrollNeeded = !fullyInViewport(el);

			if (!scrollNeeded) return;

			const headerHeight = parseInt(
				window.getComputedStyle(document.body).getPropertyValue('--header-height'),
				10,
			);
			const { top, bottom } = el.getBoundingClientRect();

			if (indexIncreased) window.scrollTo(0, window.scrollY + bottom - window.innerHeight);
			else window.scrollTo(0, window.scrollY + top - headerHeight);
		});
	}

	handleTextFilter = (textFilter: string): void => {
		this.setState({
			textFilter,
			renderAllBookmarks: false,
			focusedBookmarkIndex: 0,
		});
	}

	setNumBookmarksRemaining = (numRemainingBookmarks: number): void => {
		this.setState({ numRemainingBookmarks });
	}

	fetchLiveBookmarks = (): Promise<void> => new Promise((resolve) => {
		chrome.runtime.sendMessage({ requestBookmarks: true });

		this.resolveBookmarksPromise = resolve;
	})

	fetchCachedBookmarks = (): void => {
		chrome.storage.local.get('bookmarks', (data) => {
			this.setState({ bookmarks: data.bookmarks || [] });

			if (this.resolveBookmarksPromise) {
				this.resolveBookmarksPromise();

				this.resolveBookmarksPromise = undefined;
			}
		});
	}

	renderAllBookmarks = (): void => {
		this.setState({ renderAllBookmarks: true });
	}

	simulateBookmarkClick = (): void => {
		if (!this.numRenderedBookmarks) {
			this.setState({
				textFilter: '',
			});

			return;
		}

		const focusedBookmarkRef = this.bookmarkRefs.get(this.state.focusedBookmarkIndex);

		if (focusedBookmarkRef) (focusedBookmarkRef.current as HTMLElement).click();
	}

	// Open the specified bookmark(s), or all presently filtered bookmarks by
	// default
	openBookmarks = (...urlsArgs: string[]): void => {
		// Like this as can't do rest param w/ default arg
		const urls = urlsArgs.length
			? urlsArgs
			: filterBookmarks(this.state.bookmarks, this.state.textFilter).map(bm => bm.url);

		urls.forEach((url) => {
			chrome.tabs.create({ url: ensureValidURL(url) });
		});

		window.close();
	}

	render (): JSX.Element {
		const filteredBookmarks = filterBookmarks(this.state.bookmarks, this.state.textFilter);

		const bookmarksToRender =
			this.state.renderAllBookmarks
				? filteredBookmarks
				: filteredBookmarks.slice(0, MAX_BOOKMARKS_TO_RENDER);

		this.numRenderedBookmarks = bookmarksToRender.length;

		const RenderedBookmarks = bookmarksToRender.length
			? bookmarksToRender.map((bookmark, index) => {
				const ref: RefObject<ForwardRefElementType> = createRef();
				this.bookmarkRefs.set(index, ref);

				return (
					<Bookmark
						key={bookmark.key}
						title={bookmark.title}
						url={bookmark.url}
						desc={bookmark.desc}
						tags={bookmark.tags}
						textFilter={this.state.textFilter}
						isFocused={this.state.focusedBookmarkIndex === index}
						openBookmark={this.openBookmarks}
						ref={ref}
					/>
				);
			})
			: null;

		const numRemainingBookmarks = filteredBookmarks.length - bookmarksToRender.length;
		if (this.state.numRemainingBookmarks !== numRemainingBookmarks) {
			this.setNumBookmarksRemaining(numRemainingBookmarks);
		}

		const RenderedLoadMoreBookmarks = numRemainingBookmarks ? (
			<LoadMoreBookmarks
				numRemainingBookmarks={numRemainingBookmarks}
				renderAllBookmarks={this.renderAllBookmarks}
			/>
		) : null;

		const mainContent = this.state.displayTutorialMessage ? (
			<TutorialMessage />
		) : (
			<div>
				<ul className="bookmarks">
					{RenderedBookmarks}
				</ul>
				{RenderedLoadMoreBookmarks}
			</div>
		);

		return (
			<div>
				<ErrorPopup msg={this.state.errMsg} />

				<Loader shouldDisplayLoader={this.state.loading}>
					<div className="content-wrapper">
						<BookmarksForm
							shouldEnableSearch={!!this.state.bookmarks.length}
							updateTextFilter={this.handleTextFilter}
							textFilter={this.state.textFilter}
							refreshBookmarks={this.fetchLiveBookmarks}
							triggerBookmarkOpen={this.simulateBookmarkClick}
							triggerBookmarkMultiOpen={this.openBookmarks}
						/>

						<main className="content">
							{mainContent}
						</main>
					</div>
				</Loader>
			</div>
		);
	}
}

render(<ContentPage />, document.querySelector('.js-root'));
