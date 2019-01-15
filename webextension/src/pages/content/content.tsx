import React, { SFC } from 'react';
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
	numRemainingBookmarks: number;
	displayTutorialMessage: boolean;
}

const ContentPage: SFC<Props> = props => (
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

export default ContentPage;
