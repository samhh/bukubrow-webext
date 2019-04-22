import React, { FC } from 'react';
import { Maybe } from 'purify-ts/Maybe';
import BookmarkForm from 'Components/bookmark-form';

interface Props {
	onSubmit(bookmark: LocalBookmark): void;
	bookmark: Maybe<LocalBookmark>;
}

const BookmarkEditForm: FC<Props> = props => (
	<BookmarkForm
		bookmark={props.bookmark}
		onSubmit={props.onSubmit}
	/>
);

export default BookmarkEditForm;
