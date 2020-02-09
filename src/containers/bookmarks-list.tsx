import React, { useRef, FC } from 'react';
import { pipe } from 'fp-ts/lib/pipeable';
import * as O from 'fp-ts/lib/Option';
import { useSelector, useDispatch } from '~~/store';
import { getFocusedBookmark, getParsedFilter, getWeightedLimitedFilteredBookmarks } from '~~/store/selectors';
import {
	initiateBookmarkEdit, initiateBookmarkDeletion,
	attemptFocusedBookmarkIndexIncrement, attemptFocusedBookmarkIndexDecrement,
	openBookmarkAndExit,
} from '~~/store/bookmarks/epics';
// import { Key } from 'ts-key-enum';
import { scrollToEl } from '~~/modules/scroll-window';
import useListenToKeydown from '~~/hooks/listen-to-keydown';
import styled from '~~/styles';
import Bookmark from '~~/components/bookmark';

const WrapperList = styled.ul`
	margin: 0;
	padding: 0;
	border: 1px solid ${(props): string => props.theme.backgroundColorOffset};
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
		if (evt.key === 'Enter') {
			const { focusedBookmark: liveFocusedBookmark } = keydownDataRef.current;

			if (O.isSome(liveFocusedBookmark)) {
				dispatch(openBookmarkAndExit(liveFocusedBookmark.value.id));
			}
		}

		// preventDefault to prevent keyboard scrolling
		if (evt.key === 'ArrowUp') {
			evt.preventDefault();
			dispatch(attemptFocusedBookmarkIndexDecrement());

			if (activeBookmarkEl && activeBookmarkEl.current) scrollToEl(activeBookmarkEl.current);
		}

		if (evt.key === 'ArrowDown') {
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
						openBookmark={(bmId): void => dispatch(openBookmarkAndExit(bmId))}
						onEdit={(bmId): void => dispatch(initiateBookmarkEdit(bmId))}
						onDelete={(bmId): void => dispatch(initiateBookmarkDeletion(bmId))}
						ref={isFocused ? activeBookmarkEl : undefined}
					/>
				);
			})}
		</WrapperList>
	);
};

export default BookmarksList;

