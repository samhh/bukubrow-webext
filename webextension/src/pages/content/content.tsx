import React, { SFC } from 'react';
import useListenToKeydown from 'Hooks/listen-to-keydown';
import { Key } from 'ts-key-enum';
import s from './content.css';

import BookmarkAddForm from 'Containers/bookmark-add-form/';
import BookmarkDeleteForm from 'Containers/bookmark-delete-form/';
import BookmarkEditForm from 'Containers/bookmark-edit-form/';
import BookmarksList from 'Containers/bookmarks-list/';
import ErrorMessages from 'Containers/error-messages/';
import LoadMoreBookmarks from 'Components/load-more-bookmarks/';
import OpenAllBookmarksConfirmation from 'Containers/open-all-bookmarks-confirmation/';
import SearchControls from 'Containers/search-controls/';
import TutorialMessage from 'Components/tutorial-message/';

interface Props {
	onEnableLimitlessRender(): void;
	toggleAddBookmarkForm(): void;
	openAllFilteredBookmarksWithoutConfirmation(): void;
	refreshBookmarks(): void;
	numRemainingBookmarks: number;
	displayTutorialMessage: boolean;
}

let prevEid: symbol;

const ContentPage: SFC<Props> = (props) => {
	const [evts, eid] = useListenToKeydown();
	const activeKeys = Object.keys(evts);

	if (eid !== prevEid) {
		prevEid = eid;

		if (activeKeys.includes(Key.Control)) {
			if (activeKeys.includes('d')) props.toggleAddBookmarkForm();
			if (activeKeys.includes('o')) props.openAllFilteredBookmarksWithoutConfirmation();
			if (activeKeys.includes('r')) props.refreshBookmarks();
		}
	}

	return (
		<>
			<BookmarkAddForm />
			<BookmarkEditForm />
			<BookmarkDeleteForm />

			<OpenAllBookmarksConfirmation />

			<ErrorMessages />

			<div className={s.content}>
				<SearchControls />

				<main>
					{props.displayTutorialMessage
						? <TutorialMessage />
						: (
							<>
								<BookmarksList />

								{!!props.numRemainingBookmarks && (
									<LoadMoreBookmarks
										numRemainingBookmarks={props.numRemainingBookmarks}
										renderAllBookmarks={props.onEnableLimitlessRender}
									/>
								)}
							</>
						)
					}
				</main>
			</div>
		</>
	);
};

export default ContentPage;
