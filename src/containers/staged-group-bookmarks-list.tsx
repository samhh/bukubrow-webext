import React, { FC } from 'react';
import { Just } from 'purify-ts/Maybe';
import { useDispatch, useSelector } from 'Store';
import { setStagedBookmarksGroupBookmarkEditId, deleteStagedBookmarksGroup } from 'Store/bookmarks/actions';
import { setPage } from 'Store/user/actions';
import { getStagedGroupToEditWeightedBookmarks } from 'Store/selectors';
import { deleteStagedBookmarksGroupBookmarkOrEntireGroup, openBookmarkAndExit, addAllBookmarksFromStagedGroup } from 'Store/bookmarks/epics';
import { Page } from 'Store/user/types';
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

const StagedGroupBookmarksList: FC = () => {
	const stagedGroupId = useSelector(state => state.bookmarks.stagedBookmarksGroupEditId);
	const bookmarks = useSelector(getStagedGroupToEditWeightedBookmarks).orDefault([]);
	const dispatch = useDispatch();

	const handleOpenBookmark = (bmId: number) => {
		dispatch(openBookmarkAndExit(bmId, stagedGroupId));
	};

	const handleEditBookmark = (bmId: number) => {
		dispatch(setStagedBookmarksGroupBookmarkEditId(Just(bmId)));
		dispatch(setPage(Page.EditStagedBookmark));
	};

	const handleDeleteBookmark = (bmId: number) => {
		stagedGroupId.ifJust((grpId) => {
			dispatch(deleteStagedBookmarksGroupBookmarkOrEntireGroup(grpId, bmId));
		});
	};

	const handleDeleteGroup = () => {
		stagedGroupId.ifJust((grpId) => {
			dispatch(deleteStagedBookmarksGroup(grpId));
			dispatch(setPage(Page.StagedGroupsList));
		});
	};

	const handlePublish = () => {
		stagedGroupId.ifJust((grpId) => {
			dispatch(addAllBookmarksFromStagedGroup(grpId));
			dispatch(setPage(Page.StagedGroupsList));
		});
	};

	return (
		<>
			<WrapperList>
				{bookmarks.map(bookmark => (
					<Bookmark
						key={bookmark.id}
						id={bookmark.id}
						title={bookmark.title}
						url={bookmark.url}
						desc={bookmark.desc}
						tags={bookmark.tags}
						activeTabURLMatch={bookmark.weight}
						openBookmark={handleOpenBookmark}
						onEdit={handleEditBookmark}
						onDelete={handleDeleteBookmark}
					/>
				))}
			</WrapperList>

			<ControlsWrapper>
				<ControlsButton onClick={handleDeleteGroup}>Delete Group</ControlsButton>
				<ControlsButton onClick={handlePublish}>Commit Bookmarks to Buku</ControlsButton>
			</ControlsWrapper>
		</>
	);
};

export default StagedGroupBookmarksList;
