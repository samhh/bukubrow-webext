import React, { SFC } from 'react';
import BookmarkForm from 'Components/bookmark-form/';

interface Props {
	onClose(): void;
	onSubmit(bookmark: LocalBookmark): void;
	display: boolean;
	bookmark?: LocalBookmark;
}

const BookmarkEditForm: SFC<Props> = props => props.display && props.bookmark && (
	<BookmarkForm
		bookmark={props.bookmark}
		onClose={props.onClose}
		onSubmit={props.onSubmit}
	/>
) || null;

export default BookmarkEditForm;
