import React, { SFC } from 'react';
import BookmarkForm from 'Components/bookmark-form/';

interface Props {
	onClose(): void;
	onSubmit(bookmark: LocalBookmark): void;
	display: boolean;
	defaultTitle: LocalBookmark['title'];
	defaultUrl: LocalBookmark['url'];
}

const BookmarkEditForm: SFC<Props> = props => props.display && (
	<BookmarkForm
		bookmark={{
			title: props.defaultTitle,
			url: props.defaultUrl,
		}}
		onClose={props.onClose}
		onSubmit={props.onSubmit}
	/>
) || null;

export default BookmarkEditForm;
