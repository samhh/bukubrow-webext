import React from 'react';
import { LocalBookmarkWeighted } from 'Modules/bookmarks';
import styled from 'Styles';
import Bookmark from 'Components/bookmark';
import Button from 'Components/button';

const WrapperList = styled.ul`
	margin: 0;
	padding: 0;
	border: 1px solid ${props => props.theme.backgroundColorOffset};
	list-style: none;
`;

const ControlsWrapper = styled.div`
	padding: 1rem;
`;

const ControlsButton = styled(Button)`
	&:not(:last-child) {
		margin-right: 1rem;
	}
`;

interface Props {
	onOpenBookmark(id: LocalBookmarkWeighted['id']): void;
	onEditBookmark(id: LocalBookmarkWeighted['id']): void;
	onDeleteBookmark(id: LocalBookmarkWeighted['id']): void;
	onPublish(): void;
	onDeleteGroup(): void;
	bookmarks: LocalBookmarkWeighted[];
}

const StagedGroupBookmarksList: Comp<Props> = (props) => {
	return (
		<>
			<WrapperList>
				{props.bookmarks.map(bookmark => (
					<Bookmark
						key={bookmark.id}
						id={bookmark.id}
						title={bookmark.title}
						url={bookmark.url}
						desc={bookmark.desc}
						tags={bookmark.tags}
						activeTabURLMatch={bookmark.weight}
						openBookmark={props.onOpenBookmark}
						onEdit={props.onEditBookmark}
						onDelete={props.onDeleteBookmark}
					/>
				))}
			</WrapperList>

			<ControlsWrapper>
				<ControlsButton label="Delete Group" onClick={props.onDeleteGroup} />
				<ControlsButton label="Commit Bookmarks to Buku" onClick={props.onPublish} />
			</ControlsWrapper>
		</>
	);
};

export default StagedGroupBookmarksList;
