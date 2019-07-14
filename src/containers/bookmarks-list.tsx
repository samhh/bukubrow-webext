import React, { useRef, FC } from 'react';
import { map, isSome, toNullable } from 'fp-ts/lib/Option';
import { pipe } from 'fp-ts/lib/pipeable';
import { useSelector, useDispatch } from 'Store';
import { getFocusedBookmark, getParsedFilter, getWeightedLimitedFilteredBookmarks } from 'Store/selectors';
import {
	initiateBookmarkEdit, initiateBookmarkDeletion,
	attemptFocusedBookmarkIndexIncrement, attemptFocusedBookmarkIndexDecrement,
	openBookmarkAndExit,
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
	const focusedBookmarkId = pipe(focusedBookmark, map(bm => bm.id));
	const parsedFilter = useSelector(getParsedFilter);
	const dispatch = useDispatch();

	// Prevent stale data in keydown hook callback
	const keydownDataRef = useRef({ focusedBookmark });
	keydownDataRef.current = { focusedBookmark };

	const activeBookmarkEl = useRef<HTMLElement>(null);

	useListenToKeydown((evt) => {
		if (evt.key === Key.Enter) {
			const { focusedBookmark: liveFocusedBookmark } = keydownDataRef.current;

			if (isSome(liveFocusedBookmark)) {
				dispatch(openBookmarkAndExit(liveFocusedBookmark.value.id));
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
				const isFocused = bookmark.id === toNullable(focusedBookmarkId);

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
						openBookmark={bmId => dispatch(openBookmarkAndExit(bmId))}
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

