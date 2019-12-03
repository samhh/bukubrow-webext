import React, { useRef, FC } from 'react';
import { pipe } from 'fp-ts/lib/pipeable';
import * as O from 'fp-ts/lib/Option';
import { useSelector, useDispatch } from 'Store';
import { getFocusedBookmark, getParsedFilter, getWeightedLimitedFilteredBookmarks } from 'Store/selectors';
import { openBookmark } from 'Store/bookmarks/actions';
import {
	initiateBookmarkEdit, initiateBookmarkDeletion,
	attemptFocusedBookmarkIndexIncrement, attemptFocusedBookmarkIndexDecrement,
} from 'Store/bookmarks/epics';
import { Key } from 'ts-key-enum';
import { scrollToEl } from 'Modules/scroll-window';
import useListenToKeydown from 'Hooks/listen-to-keydown';
import styled from 'Styles';
import Bookmark from 'Components/bookmark';

const WrapperList = styled.ul`
	margin: 0;
	padding: 0;
	border: 1px solid ${props => props.theme.backgroundColorOffset};
	list-style: none;
`;

const BookmarksList: FC = () => {
	const bookmarks = useSelector(getWeightedLimitedFilteredBookmarks);
	const focusedBookmark = useSelector(getFocusedBookmark);
	const focusedBookmarkId = pipe(focusedBookmark, O.map(bm => bm.id));
	const parsedFilter = useSelector(getParsedFilter);
	const dispatch = useDispatch();

	// Prevent stale data in keydown hook callback
	const keydownDataRef = useRef({ focusedBookmark });
	keydownDataRef.current = { focusedBookmark };

	const activeBookmarkEl = useRef<HTMLElement>(null);

	useListenToKeydown((evt) => {
		if (evt.key === Key.Enter) {
			const { focusedBookmark: liveFocusedBookmark } = keydownDataRef.current;

			if (O.isSome(liveFocusedBookmark)) {
				dispatch(openBookmark.request({ bookmarkId: liveFocusedBookmark.value.id, stagedBookmarksGroupId: O.none }));
			}
		}

		// preventDefault to prevent keyboard scrolling
		if (evt.key === Key.ArrowUp) {
			evt.preventDefault();
			dispatch(attemptFocusedBookmarkIndexDecrement());

			if (activeBookmarkEl && activeBookmarkEl.current) scrollToEl(activeBookmarkEl.current);
		}

		if (evt.key === Key.ArrowDown) {
			evt.preventDefault();
			dispatch(attemptFocusedBookmarkIndexIncrement());

			if (activeBookmarkEl && activeBookmarkEl.current) scrollToEl(activeBookmarkEl.current);
		}
	});

	return (
		<WrapperList>
			{bookmarks.map((bookmark) => {
				const isFocused = bookmark.id === O.toNullable(focusedBookmarkId);

				return (
					<Bookmark
						key={bookmark.id}
						id={bookmark.id}
						title={bookmark.title}
						url={bookmark.url}
						desc={bookmark.desc}
						tags={bookmark.tags}
						parsedFilter={parsedFilter}
						isFocused={isFocused}
						activeTabURLMatch={bookmark.weight}
						openBookmark={bmId => dispatch(openBookmark.request({ bookmarkId: bmId, stagedBookmarksGroupId: O.none }))}
						onEdit={bmId => dispatch(initiateBookmarkEdit(bmId))}
						onDelete={bmId => dispatch(initiateBookmarkDeletion(bmId))}
						ref={isFocused ? activeBookmarkEl : undefined}
					/>
				);
			})}
		</WrapperList>
	);
};

export default BookmarksList;

