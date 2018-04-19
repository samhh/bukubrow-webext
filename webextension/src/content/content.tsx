import React, { Component, createRef, FormEvent, RefObject } from 'react';
import { render } from 'react-dom';
import { sendBackendMessage, getActiveTab } from 'Comms/frontend';
import { BackendResponse } from 'Comms/shared';
import { getBookmarks } from 'Modules/cache';
import filterBookmarks from 'Modules/filter-bookmarks';
import ensureValidURL from 'Modules/ensure-valid-url';
import fullyInViewport from 'Modules/element-in-viewport';
import setTheme from 'Modules/set-theme';
import sleep from 'Modules/sleep';
import { MAX_BOOKMARKS_TO_RENDER } from 'Modules/config';
import styles from './content.css';

import Bookmark, { ForwardRefElementType } from 'Components/bookmark/';
import BookmarkForm from 'Components/bookmark-form/';
import Button from 'Components/button/';
import ErrorPopup from 'Components/error-popup/';
import LoadMoreBookmarks from 'Components/load-more-bookmarks/';
import Modal from 'Components/modal/';
import SearchControls from 'Components/search-controls/';
import TutorialMessage from 'Components/tutorial-message/';

import '../global-styles/';

interface State {
	activeUrl: string;
	errMsg: string;
	displayAdd: boolean;
	displayEdit: boolean;
	displayDelete: boolean;
	displayTutorialMessage: boolean;
	bookmarkToEditId: LocalBookmark['id'];
	bookmarkToDeleteId: LocalBookmark['id'];
	bookmarks: LocalBookmark[];
	renderAllBookmarks: boolean;
	focusedBookmarkIndex: number;
	textFilter: string;
}

class ContentPage extends Component<{}, State> {
	state = {
		activeUrl: '',
		errMsg: '',
		displayAdd: false,
		displayEdit: false,
		displayDelete: false,
		displayTutorialMessage: false,
		bookmarkToEditId: -1,
		bookmarkToDeleteId: -1,
		bookmarks: [] as LocalBookmark[],
		renderAllBookmarks: false,
		focusedBookmarkIndex: 0,
		textFilter: '',
	};

	bookmarkRefs: Map<number, RefObject<JSX.Element | {}>> = new Map();
	numRenderedBookmarks = 0;
	resolveBookmarksPromise: Function | undefined;

	componentDidMount() {
		setTheme();
		sendBackendMessage({ checkBinary: true });
		getActiveTab().then((tab) => {
			if (!tab.url) return;

			this.setState({ activeUrl: tab.url });
		});
		this.checkHasTriggeredRequest();
		this.fetchCachedBookmarks();

		// Respond to messages from the backend
		chrome.runtime.onMessage.addListener((res: BackendResponse) => {
			if ('bookmarksUpdated' in res) this.fetchCachedBookmarks();

			if ('bookmarkSaved' in res || 'bookmarkUpdated' in res || 'bookmarkDeleted' in res) {
				this.fetchLiveBookmarks();
			}

			if ('unknownError' in res) {
				const msg = 'An unknown error occurred.';

				this.initError(msg);
			}

			if ('cannotFindBinary' in res) {
				const msg = 'The binary could not be found. Please refer to the installation instructions.';

				this.initError(msg);
			}

			if ('outdatedBinary' in res) {
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
			this.setState({ displayTutorialMessage: !res.hasTriggeredRequest });
		});
	}

	fetchLiveBookmarks = (): Promise<void> => new Promise((resolve) => {
		sendBackendMessage({ requestBookmarks: true });

		this.resolveBookmarksPromise = resolve;
	})

	fetchCachedBookmarks = (): Promise<void> =>
		getBookmarks()
			.then((bookmarks) => {
				this.setState({ bookmarks });

				if (this.resolveBookmarksPromise) {
					this.resolveBookmarksPromise();

					this.resolveBookmarksPromise = undefined;
				}
			})
			.catch(() => {
				this.fetchLiveBookmarks();
			})

	saveBookmark = (bookmark: LocalBookmarkUnsaved): void => {
		sendBackendMessage({
			bookmark,
			saveBookmark: true,
		});
	}

	updateBookmark = (bookmark: LocalBookmark): void => {
		sendBackendMessage({
			bookmark,
			updateBookmark: true,
		});
	}

	initError = (errMsg: string, errTimeInSecs: number = 15): void => {
		this.setState({ errMsg });

		sleep(errTimeInSecs * 1000)
			.then(() => {
				this.setState({ errMsg: '' });
			});
	}

	updateFocusedBookmark = (index: number): void => {
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

	handleOpenAddBookmark = (): void => {
		this.setState({ displayAdd: true });
	}

	handleCloseAddBookmark = (): void => {
		this.setState({ displayAdd: false });
	}

	handleOpenEditBookmark = (bookmarkId: LocalBookmark['id']): void => {
		this.setState({ displayEdit: true, bookmarkToEditId: bookmarkId });
	}

	handleCloseEditBookmark = (): void => {
		this.setState({ displayEdit: false });
	}

	handleInitiateBookmarkDeletion = (bookmarkId: LocalBookmark['id']): void => {
		this.setState({
			displayDelete: true,
			bookmarkToDeleteId: bookmarkId,
		});
	}

	handleCancelBookmarkDeletion = (): void => {
		this.setState({ displayDelete: false });
	}

	handleConfirmBookmarkDeletion = (): void => {
		sendBackendMessage({ deleteBookmark: true, bookmarkId: this.state.bookmarkToDeleteId });

		this.setState({ displayDelete: false });
	}

	handleTextFilter = (textFilter: string): void => {
		this.setState({
			textFilter,
			renderAllBookmarks: false,
			focusedBookmarkIndex: 0,
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
		const bmToDel = this.state.bookmarks.find(bm => bm.id === this.state.bookmarkToDeleteId);

		// TODO map out here instead of in func?
		const filteredBookmarks = filterBookmarks(this.state.bookmarks, this.state.textFilter);

		const bookmarksToRender =
			this.state.renderAllBookmarks
				? filteredBookmarks
				: filteredBookmarks.slice(0, MAX_BOOKMARKS_TO_RENDER);

		this.numRenderedBookmarks = bookmarksToRender.length;

		const numRemainingBookmarks = filteredBookmarks.length - bookmarksToRender.length;

		return (
			<div>
				{this.state.displayAdd && (
					<BookmarkForm
						bookmark={{ url: this.state.activeUrl }}
						onClose={this.handleCloseAddBookmark}
						onSubmit={this.saveBookmark}
					/>
				)}

				{this.state.displayEdit && (
					<BookmarkForm
						bookmark={this.state.bookmarks.find(bm => bm.id === this.state.bookmarkToEditId)}
						onClose={this.handleCloseEditBookmark}
						onSubmit={this.updateBookmark}
					/>
				)}

				{this.state.displayDelete && bmToDel && (
					<Modal>
						<header>
							<h1 className={styles['delete-heading']}>Delete bookmark <em>{bmToDel.title}</em>?</h1>
						</header>

						<Button
							onClick={this.handleCancelBookmarkDeletion}
							label="Cancel"
						/>

						<Button
							onClick={this.handleConfirmBookmarkDeletion}
							label="Delete"
							className={styles['delete-btn-confirm']}
						/>
					</Modal>
				)}

				<ErrorPopup msg={this.state.errMsg} />

				<div className={styles.content}>
					<SearchControls
						onAdd={this.handleOpenAddBookmark}
						shouldEnableSearch={!!this.state.bookmarks.length}
						updateTextFilter={this.handleTextFilter}
						textFilter={this.state.textFilter}
						refreshBookmarks={this.fetchLiveBookmarks}
						triggerBookmarkOpen={this.simulateBookmarkClick}
						triggerBookmarkMultiOpen={this.openBookmarks}
					/>

					<main>
						{this.state.displayTutorialMessage ? (
							<TutorialMessage />
						) : (
							<>
								<ul className={styles.bookmarks}>
									{bookmarksToRender.map((bookmark, index) => {
										const ref: RefObject<ForwardRefElementType> = createRef();
										this.bookmarkRefs.set(index, ref);

										return (
											<Bookmark
												key={bookmark.id}
												id={bookmark.id}
												title={bookmark.title}
												url={bookmark.url}
												desc={bookmark.desc}
												tags={bookmark.tags}
												textFilter={this.state.textFilter}
												isFocused={this.state.focusedBookmarkIndex === index}
												openBookmark={this.openBookmarks}
												onEdit={this.handleOpenEditBookmark}
												onDelete={this.handleInitiateBookmarkDeletion}
												ref={ref}
											/>
										);
									})}
								</ul>

								{!!numRemainingBookmarks && (
									<LoadMoreBookmarks
										numRemainingBookmarks={numRemainingBookmarks}
										renderAllBookmarks={this.renderAllBookmarks}
									/>
								)}
							</>
						)}
					</main>
				</div>
			</div>
		);
	}
}

render(<ContentPage />, document.querySelector('.js-root'));
