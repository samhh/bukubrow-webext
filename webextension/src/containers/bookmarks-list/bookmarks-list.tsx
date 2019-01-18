import React, { useRef, SFC } from 'react';
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
	openFocusedBookmark(): void;
	attemptFocusedBookmarkIndexIncrement(): boolean;
	attemptFocusedBookmarkIndexDecrement(): boolean;
	bookmarks: LocalBookmark[];
	searchFilter: string;
	focusedBookmarkId?: BookmarkId;
}

let prevEid: symbol;

const BookmarksList: SFC<Props> = (props) => {
	const prev = useRef<HTMLElement>(null);
	const curr = useRef<HTMLElement>(null);
	const next = useRef<HTMLElement>(null);

	const [evts, eid] = useListenToKeydown();

	if (eid !== prevEid) {
		prevEid = eid;

		const enterEvt: KeyboardEvent | undefined = evts[Key.Enter];
		const arrowUpEvt: KeyboardEvent | undefined = evts[Key.ArrowUp];
		const arrowDownEvt: KeyboardEvent | undefined = evts[Key.ArrowDown];

		if (enterEvt) props.openFocusedBookmark();

		// preventDefault to prevent keyboard scrolling
		if (arrowUpEvt) {
			arrowUpEvt.preventDefault();
			props.attemptFocusedBookmarkIndexDecrement();

			if (prev && prev.current) scrollToEl(prev.current);
		}

		if (arrowDownEvt) {
			arrowDownEvt.preventDefault();
			props.attemptFocusedBookmarkIndexIncrement();

			if (next && next.current) scrollToEl(next.current);
		}
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
