import React, { FC } from 'react';
import * as O from 'fp-ts/lib/Option';
import { useSelector, useDispatch } from 'Store';
import { addBookmark } from 'Store/bookmarks/epics';
import BookmarkForm from 'Components/bookmark-form';

const BookmarkAddForm: FC = () => {
	const { pageTitle, pageUrl } = useSelector(state => state.browser);
	const dispatch = useDispatch();

	return (
		<BookmarkForm
			bookmark={O.some({
				title: pageTitle,
				url: pageUrl,
			})}
			onSubmit={(bm): void => void dispatch(addBookmark(bm))}
		/>
	);
};

export default BookmarkAddForm;

