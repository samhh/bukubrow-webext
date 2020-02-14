import React, { FC } from 'react';
import { useDispatch, useSelector } from '~/store';
import { setLimitNumRendered } from '~/store/bookmarks/actions';
import { getNumFilteredUnrenderedBookmarks } from '~/store/selectors';
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

