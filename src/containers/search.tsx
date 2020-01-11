import React, { FC } from 'react';
import { useDispatch, useSelector } from '~/store';
import { setLimitNumRendered } from '~/store/bookmarks/actions';
import { openAllFilteredBookmarksAndExit, syncBookmarks } from '~/store/bookmarks/epics';
import { setPage } from '~/store/user/actions';
import { getNumFilteredUnrenderedBookmarks } from '~/store/selectors';
import { Page } from '~/store/user/types';
import useListenToKeydown from '~/hooks/listen-to-keydown';
import styled from '~/styles';
import BookmarksList from '~/containers/bookmarks-list';
import LoadMoreBookmarks from '~/components/load-more-bookmarks';
import SearchControls, { headerHeight } from '~/containers/search-controls';

const Wrapper = styled.div`
	padding: ${headerHeight} 0 0;
`;

const Search: FC = () => {
	const numRemainingBookmarks = useSelector(getNumFilteredUnrenderedBookmarks);
	const dispatch = useDispatch();

	useListenToKeydown((evt) => {
		if (!evt.ctrlKey) return;

		if (evt.key === 'd') dispatch(setPage(Page.AddBookmark));
		if (evt.key === 'o') dispatch(openAllFilteredBookmarksAndExit());
		if (evt.key === 'r') dispatch(syncBookmarks());
	});

	return (
		<Wrapper>
			<SearchControls />

			<main>
				<BookmarksList />

				{!!numRemainingBookmarks && (
					<LoadMoreBookmarks
						numRemainingBookmarks={numRemainingBookmarks}
						renderAllBookmarks={(): void => void dispatch(setLimitNumRendered(false))}
					/>
				)}
			</main>
		</Wrapper>
	);
};

export default Search;

