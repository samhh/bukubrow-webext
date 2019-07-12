import React, { FC } from 'react';
import { useDispatch, useSelector } from 'Store';
import { getStagedGroupBookmarkToEdit } from 'Store/selectors';
import { updateStagedBookmarksGroupBookmark } from 'Store/bookmarks/actions';
import { setPage } from 'Store/user/actions';
import { Page } from 'Store/user/types';
import BookmarkForm from 'Components/bookmark-form';

const StagedGroupBookmarkEditForm: FC = () => {
	const bookmark = useSelector(getStagedGroupBookmarkToEdit);
	const groupEditId = useSelector(state => state.bookmarks.stagedBookmarksGroupEditId);
	const dispatch = useDispatch();

	const handleSubmit = (bm: LocalBookmark) => {
		groupEditId.ifJust((grpId) => {
			dispatch(updateStagedBookmarksGroupBookmark(grpId, bm));
			dispatch(setPage(Page.StagedGroup));
		});
	};

	return bookmark.caseOf({
		Just: () => (
			<BookmarkForm
				bookmark={bookmark}
				onSubmit={handleSubmit}
			/>
		),
		Nothing: () => null,
	});
};

export default StagedGroupBookmarkEditForm;
