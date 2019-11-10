import React, { FC } from 'react';
import * as O from 'fp-ts/lib/Option';
import { formatStagedBookmarksGroupTitle } from 'Modules/bookmarks';
import { useDispatch, useSelector } from 'Store';
import { setPage } from 'Store/user/actions';
import { getSortedStagedGroups } from 'Store/selectors';
import { setStagedBookmarksGroupEditId } from 'Store/bookmarks/actions';
import styled from 'Styles';
import { Page } from 'Store/user/types';
import ListItem from 'Components/list-item';

const Wrapper = styled.ol`
	list-style: none;
	padding: 0;
`;

const GroupTitle = styled.header`
	margin: .5rem 0;
`;

const Message = styled.p`
	padding: 0 1rem;
	text-align: center;
`;

const StagedGroupsList: FC = () => {
	const groups = useSelector(getSortedStagedGroups);
	const dispatch = useDispatch();

	const handleGroupClick = (id: number) => {
		dispatch(setStagedBookmarksGroupEditId(O.some(id)));
		dispatch(setPage(Page.StagedGroup));
	};

	return (
		<Wrapper>
			{groups.length
				? groups.map(grp => (
					<ListItem key={grp.id} onClick={() => { handleGroupClick(grp.id); }}>
						<GroupTitle>{formatStagedBookmarksGroupTitle(grp)}</GroupTitle>
					</ListItem>
				))
				: <Message>There are no groups in the staging area.</Message>
			}
		</Wrapper>
	);
};

export default StagedGroupsList;

