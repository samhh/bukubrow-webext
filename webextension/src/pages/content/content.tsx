import React, { useRef } from 'react';
import useListenToKeydown from 'Hooks/listen-to-keydown';
import styled from 'Styles';

import BookmarksList from 'Containers/bookmarks-list/';
import LoadMoreBookmarks from 'Components/load-more-bookmarks';
import SearchControls, { headerHeight } from 'Containers/search-controls/';
import TutorialMessage from 'Components/tutorial-message';

const Content = styled.div`
	min-height: 30rem; /* For bookmark form in cases where there are not yet any bookmarks */
	padding: ${headerHeight} 0 0;
`;

interface Props {
	onEnableLimitlessRender(): void;
	toggleAddBookmarkForm(): void;
	openAllFilteredBookmarksWithoutConfirmation(): void;
	refreshBookmarks(): void;
	numRemainingBookmarks: number;
	displayTutorialMessage: boolean;
}

const ContentPage: Comp<Props> = (props) => {
	const propsRef = useRef(props);
	propsRef.current = props;

	useListenToKeydown((evt) => {
		const liveProps = propsRef.current;

		if (evt.ctrlKey) {
			if (evt.key === 'd') liveProps.toggleAddBookmarkForm();
			if (evt.key === 'o') liveProps.openAllFilteredBookmarksWithoutConfirmation();
			if (evt.key === 'r') liveProps.refreshBookmarks();
		}
	});

	return (
		<Content>
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
		</Content>
	);
};

export default ContentPage;
