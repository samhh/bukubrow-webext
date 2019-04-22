import React, { FC } from 'react';
import { Just } from 'purify-ts/Maybe';
import BookmarkForm from 'Components/bookmark-form';

interface Props {
	onSubmit(bookmark: LocalBookmark): void;
	defaultTitle: LocalBookmark['title'];
	defaultUrl: LocalBookmark['url'];
}

const BookmarkAddForm: FC<Props> = props => (
	<BookmarkForm
		bookmark={Just({
			title: props.defaultTitle,
			url: props.defaultUrl,
		})}
		onSubmit={props.onSubmit}
	/>
);

export default BookmarkAddForm;
