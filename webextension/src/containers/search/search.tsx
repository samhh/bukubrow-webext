import React, { useRef, FC } from 'react';
import useListenToKeydown from 'Hooks/listen-to-keydown';
import styled from 'Styles';

import BookmarksList from 'Containers/bookmarks-list/';
import LoadMoreBookmarks from 'Components/load-more-bookmarks';
import SearchControls, { headerHeight } from 'Containers/search-controls/';

const Wrapper = styled.div`
	// TODO can remove this line?
	min-height: 30rem; /* For bookmark form in cases where there are not yet any bookmarks */
	padding: ${headerHeight} 0 0;
`;

interface Props {
	onEnableLimitlessRender(): void;
	toggleAddBookmarkForm(): void;
	openAllFilteredBookmarksWithoutConfirmation(): void;
	refreshBookmarks(): void;
	numRemainingBookmarks: number;
}

const Search: FC<Props> = (props) => {
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
		<Wrapper>
			<SearchControls />

			<main>
				<BookmarksList />

				{!!props.numRemainingBookmarks && (
					<LoadMoreBookmarks
						numRemainingBookmarks={props.numRemainingBookmarks}
						renderAllBookmarks={props.onEnableLimitlessRender}
					/>
				)}
			</main>
		</Wrapper>
	);
};

export default Search;
