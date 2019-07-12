import React, { FC } from 'react';
import { useSelector, useDispatch } from 'Store';
import { setDeleteBookmarkModalDisplay } from 'Store/bookmarks/actions';
import { deleteBookmark } from 'Store/bookmarks/epics';
import { getBookmarkToDelete } from 'Store/selectors';
import styled from 'Styles';
import Button from 'Components/button';
import Modal from 'Components/modal';

const Heading = styled.h1`
	margin: 0 0 1rem;
	font-size: 2rem;
`;

const ConfirmationButton = styled(Button)`
	margin: 0 0 0 .5rem;
`;

const BookmarkDeleteForm: FC = () => {
	const bookmarkTitle = useSelector(getBookmarkToDelete).map(bm => bm.title);
	const display = bookmarkTitle.isJust() && useSelector(state => state.bookmarks.displayDeleteBookmarkModal);
	const dispatch = useDispatch();

	if (!display) return null;

	return (
		<Modal>
			<header>
				<Heading>Delete bookmark <em>{bookmarkTitle.extract()}</em>?</Heading>
			</header>

			<Button onClick={() => dispatch(setDeleteBookmarkModalDisplay(false))}>Cancel</Button>
			<ConfirmationButton onClick={() => dispatch(deleteBookmark())}>Delete</ConfirmationButton>
		</Modal>
	);
};

export default BookmarkDeleteForm;
