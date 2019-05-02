import React, { useRef, FC } from 'react';
import useListenToKeydown from 'Hooks/listen-to-keydown';
import styled from 'Styles';

import BookmarksList from 'Containers/bookmarks-list/';
import LoadMoreBookmarks from 'Components/load-more-bookmarks';
import SearchControls, { headerHeight } from 'Containers/search-controls/';

const Wrapper = styled.div`
	padding: ${headerHeight} 0 0;
`;

interface Props {
	onEnableLimitlessRender(): void;
	onGotoAddBookmarkForm(): void;
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
			if (evt.key === 'd') liveProps.onGotoAddBookmarkForm();
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
