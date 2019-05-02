import React, { FC } from 'react';
import styled from 'Styles';
import ListItem from 'Components/list-item';
import { formatStagedBookmarksGroupTitle } from 'Modules/bookmarks';

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

interface Props {
	onGroupClick(groupId: StagedBookmarksGroup['id']): void;
	exit(): void;
	stagedGroups: StagedBookmarksGroup[];
}

const StagedGroupsList: FC<Props> = props => (
	<Wrapper>
		{props.stagedGroups.length
			? props.stagedGroups.map(grp => (
				<ListItem key={grp.id} onClick={() => { props.onGroupClick(grp.id); }}>
					<GroupTitle>{formatStagedBookmarksGroupTitle(grp)}</GroupTitle>
				</ListItem>
			))
			: <Message>There are no groups in the staging area.</Message>
		}
	</Wrapper>
);

export default StagedGroupsList;
