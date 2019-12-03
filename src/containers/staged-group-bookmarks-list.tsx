import React, { FC } from 'react';
import { constVoid } from 'fp-ts/lib/function';
import * as O from 'fp-ts/lib/Option';
import { pipe } from 'fp-ts/lib/pipeable';
import { useDispatch, useSelector } from 'Store';
import { setStagedBookmarksGroupBookmarkEditId, deleteStagedBookmarksGroup } from 'Store/bookmarks/actions';
import { setPage } from 'Store/user/actions';
import { getStagedGroupToEditWeightedBookmarks } from 'Store/selectors';
import { deleteStagedBookmarksGroupBookmarkOrEntireGroup, openBookmarkAndExit, addAllBookmarksFromStagedGroup } from 'Store/bookmarks/epics';
import { Page } from 'Store/user/types';
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

const StagedGroupBookmarksList: FC = () => {
	const stagedGroupId = useSelector(state => state.bookmarks.stagedBookmarksGroupEditId);
	const bookmarksMaybe = useSelector(getStagedGroupToEditWeightedBookmarks);
	const bookmarks = O.getOrElse(() => [] as LocalBookmarkWeighted[])(bookmarksMaybe);
	const dispatch = useDispatch();

	const handleOpenBookmark = (bmId: number) => {
		dispatch(openBookmarkAndExit(bmId, stagedGroupId));
	};

	const handleEditBookmark = (bmId: number) => {
		dispatch(setStagedBookmarksGroupBookmarkEditId(O.some(bmId)));
		dispatch(setPage(Page.EditStagedBookmark));
	};

	const [handleDeleteBookmark, handleDeleteGroup, handlePublish] = pipe(stagedGroupId, O.fold(
		() => [constVoid, constVoid, constVoid],
		grpId => [
			(bmId: number) => {
				dispatch(deleteStagedBookmarksGroupBookmarkOrEntireGroup(grpId, bmId));
			},
			() => {
				dispatch(deleteStagedBookmarksGroup(grpId));
				dispatch(setPage(Page.StagedGroupsList));
			},
			() => {
				dispatch(addAllBookmarksFromStagedGroup(grpId));
				dispatch(setPage(Page.StagedGroupsList));
			},
		],
	));

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

