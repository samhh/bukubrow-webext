import React, { useRef, SFC } from 'react';
import { scrollToEl } from 'Modules/scroll-window';
import { ParsedInputResult } from 'Modules/parse-search-input';
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
	parsedFilter: ParsedInputResult;
	focusedBookmarkId?: BookmarkId;
}

const BookmarksList: SFC<Props> = (props) => {
	const activeBookmarkEl = useRef<HTMLElement>(null);

	const propsRef = useRef(props);
	propsRef.current = props;

	useListenToKeydown((evt) => {
		const liveProps = propsRef.current;

		if (evt.key === Key.Enter) liveProps.openFocusedBookmark();

		// preventDefault to prevent keyboard scrolling
		if (evt.key === Key.ArrowUp) {
			evt.preventDefault();
			liveProps.attemptFocusedBookmarkIndexDecrement();

			if (activeBookmarkEl && activeBookmarkEl.current) scrollToEl(activeBookmarkEl.current);
		}

		if (evt.key === Key.ArrowDown) {
			evt.preventDefault();
			liveProps.attemptFocusedBookmarkIndexIncrement();

			if (activeBookmarkEl && activeBookmarkEl.current) scrollToEl(activeBookmarkEl.current);
		}
	});

	return (
		<ul className={s.wrapper}>
			{props.bookmarks.map(bookmark => (
				<Bookmark
					key={bookmark.id}
					id={bookmark.id}
					title={bookmark.title}
					url={bookmark.url}
					desc={bookmark.desc}
					tags={bookmark.tags}
					parsedFilter={props.parsedFilter}
					isFocused={bookmark.id === props.focusedBookmarkId}
					openBookmark={props.onOpenBookmark}
					onEdit={props.onEditBookmark}
					onDelete={props.onDeleteBookmark}
					ref={bookmark.id === props.focusedBookmarkId ? activeBookmarkEl : undefined}
				/>
			))}
		</ul>
	);
};

export default BookmarksList;
