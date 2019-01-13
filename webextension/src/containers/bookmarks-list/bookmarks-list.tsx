import React, { useState, useRef, SFC } from 'react';
import { scrollToEl } from 'Modules/scroll-window';
import useListenToKeydown from 'Hooks/listen-to-keydown';
import { Key } from 'ts-key-enum';
import s from './styles.css';
import Bookmark from 'Components/bookmark/';

type BookmarkId = LocalBookmark['id'];

interface Props {
	onOpenBookmark(id: BookmarkId): void;
	onEditBookmark(id: BookmarkId): void;
	onDeleteBookmark(id: BookmarkId): void;
	attemptFocusedBookmarkIndexIncrement(): boolean;
	attemptFocusedBookmarkIndexDecrement(): boolean;
	bookmarks: LocalBookmark[];
	searchFilter: string;
	focusedBookmarkId?: BookmarkId;
}

const BookmarksList: SFC<Props> = (props) => {
	const prev = useRef<Nullable<HTMLElement>>(null);
	const curr = useRef<Nullable<HTMLElement>>(null);
	const next = useRef<Nullable<HTMLElement>>(null);
	const [evtId, setEvtId] = useState<number>(-1);
	const evt = useListenToKeydown();

	if (evt && evt.timeStamp !== evtId) {
		// preventDefault to prevent keyboard scrolling
		if (evt.key === Key.ArrowUp) {
			evt.preventDefault();
			props.attemptFocusedBookmarkIndexDecrement();

			if (prev && prev.current) scrollToEl(prev.current);
		}
		if (evt.key === Key.ArrowDown) {
			evt.preventDefault();
			props.attemptFocusedBookmarkIndexIncrement();

			if (next && next.current) scrollToEl(next.current);
		}

		setEvtId(evt.timeStamp);
	}

	const focusedIndex = props.bookmarks.findIndex(bm => bm.id === props.focusedBookmarkId);

	return (
		<ul className={s.wrapper}>
			{props.bookmarks.map((bookmark, index) => {
				const ref = index === focusedIndex - 1
					? prev
					: index === focusedIndex
						? curr
						: index === focusedIndex + 1
							? next
							: undefined;

				return (
					<Bookmark
						key={bookmark.id}
						id={bookmark.id}
						title={bookmark.title}
						url={bookmark.url}
						desc={bookmark.desc}
						tags={bookmark.tags}
						textFilter={props.searchFilter}
						isFocused={bookmark.id === props.focusedBookmarkId}
						openBookmark={props.onOpenBookmark}
						onEdit={props.onEditBookmark}
						onDelete={props.onDeleteBookmark}
						ref={ref}
					/>
				);
			})}
		</ul>
	);
};

export default BookmarksList;
