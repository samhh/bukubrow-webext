import React, { FC } from 'react';
import { useDispatch, useSelector } from 'Store';
import { setLimitNumRendered, syncBookmarks, openAllFilteredBookmarks } from 'Store/bookmarks/actions';
import { setPage } from 'Store/user/actions';
import { getNumFilteredUnrenderedBookmarks } from 'Store/selectors';
import { Page } from 'Store/user/types';
import useListenToKeydown from 'Hooks/listen-to-keydown';
import styled from 'Styles';
import BookmarksList from 'Containers/bookmarks-list';
import LoadMoreBookmarks from 'Components/load-more-bookmarks';
import SearchControls, { headerHeight } from 'Containers/search-controls';

const Wrapper = styled.div`
	padding: ${headerHeight} 0 0;
`;

const Search: FC = () => {
	const numRemainingBookmarks = useSelector(getNumFilteredUnrenderedBookmarks);
	const dispatch = useDispatch();

	useListenToKeydown((evt) => {
		if (!evt.ctrlKey) return;

		if (evt.key === 'd') dispatch(setPage(Page.AddBookmark));
		if (evt.key === 'o') dispatch(openAllFilteredBookmarks());
		if (evt.key === 'r') dispatch(syncBookmarks.request());
	});

	return (
		<Wrapper>
			<SearchControls />

			<main>
				<BookmarksList />

				{!!numRemainingBookmarks && (
					<LoadMoreBookmarks
						numRemainingBookmarks={numRemainingBookmarks}
						renderAllBookmarks={() => dispatch(setLimitNumRendered(false))}
					/>
				)}
			</main>
		</Wrapper>
	);
};

export default Search;
