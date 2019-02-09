import React from 'react';
import { Maybe } from 'purify-ts/Maybe';
import BookmarkForm from 'Components/bookmark-form/';

interface Props {
	onClose(): void;
	onSubmit(bookmark: LocalBookmark): void;
	display: boolean;
	bookmark: Maybe<LocalBookmark>;
}

const BookmarkEditForm: Comp<Props> = props => props.display && props.bookmark.isJust() && (
	<BookmarkForm
		bookmark={props.bookmark}
		onClose={props.onClose}
		onSubmit={props.onSubmit}
	/>
) || null;

export default BookmarkEditForm;
