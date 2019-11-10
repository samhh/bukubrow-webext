import React, { FC } from 'react';
import { pipe } from 'fp-ts/lib/pipeable';
import * as O from 'fp-ts/lib/Option';
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
	const bmToDel = useSelector(getBookmarkToDelete);
	const shouldDisplay = useSelector(state => state.bookmarks.displayDeleteBookmarkModal);
	const dispatch = useDispatch();

	const display = shouldDisplay && O.isSome(bmToDel);
	if (!display) return null;

	const bookmarkTitle = pipe(bmToDel, O.fold(() => '', bm => bm.title));
	return (
		<Modal>
			<header>
				<Heading>Delete bookmark <em>{bookmarkTitle}</em>?</Heading>
			</header>

			<Button onClick={() => dispatch(setDeleteBookmarkModalDisplay(false))}>Cancel</Button>
			<ConfirmationButton onClick={() => dispatch(deleteBookmark())}>Delete</ConfirmationButton>
		</Modal>
	);
};

export default BookmarkDeleteForm;

