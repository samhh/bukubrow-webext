import React, { FC } from 'react';
import { useDispatch, useSelector } from '~/store';
import { matchesTerminology } from '~/modules/terminology';
import { setDisplayOpenAllBookmarksConfirmation } from '~/store/user/actions';
import { openAllFilteredBookmarksAndExit } from '~/store/bookmarks/epics';
import { getUnlimitedFilteredBookmarks } from '~/store/selectors';
import Button from '~/components/button';

import Modal from '~/components/modal';
import styled from '~/styles';

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

					<Button onClick={(): void => void dispatch(setDisplayOpenAllBookmarksConfirmation(false))}>Cancel</Button>
					<ConfirmationButton onClick={(): void => dispatch(openAllFilteredBookmarksAndExit())}>Open</ConfirmationButton>
				</Modal>
			)}
		</>
	);
};

export default OpenAllBookmarksConfirmation;

