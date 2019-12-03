import React, { FC } from 'react';
import { useDispatch, useSelector } from 'Store';
import { matchesTerminology } from 'Modules/terminology';
import { setDisplayOpenAllBookmarksConfirmation } from 'Store/user/actions';
import { openAllFilteredBookmarks } from 'Store/bookmarks/actions';
import { getUnlimitedFilteredBookmarks } from 'Store/selectors';
import Button from 'Components/button';

import Modal from 'Components/modal';
import styled from 'Styles';

const Heading = styled.h1`
	margin: 0 0 1rem;
	font-size: 2rem;
`;

const ConfirmationButton = styled(Button)`
	margin: 0 0 0 .5rem;
`;

const OpenAllBookmarksConfirmation: FC = () => {
	const display = useSelector(state => state.user.displayOpenAllBookmarksConfirmation);
	const numFilteredBookmarks = useSelector(getUnlimitedFilteredBookmarks).length;
	const dispatch = useDispatch();

	return (
		<>
			{display && (
				<Modal>
					<header>
						<Heading>{matchesTerminology(numFilteredBookmarks)}?</Heading>
					</header>

					<Button onClick={() => dispatch(setDisplayOpenAllBookmarksConfirmation(false))}>Cancel</Button>
					<ConfirmationButton onClick={() => dispatch(openAllFilteredBookmarks())}>Open</ConfirmationButton>
				</Modal>
			)}
		</>
	);
};

export default OpenAllBookmarksConfirmation;
