import React, { FC } from 'react';
import { isSome, isNone } from 'fp-ts/lib/Option';
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
		if (isSome(groupEditId)) {
			dispatch(updateStagedBookmarksGroupBookmark(groupEditId.value, bm));
			dispatch(setPage(Page.StagedGroup));
		}
	};

	if (isNone(bookmark)) return null;

	return (
		<BookmarkForm
			bookmark={bookmark}
			onSubmit={handleSubmit}
		/>
	);
};

export default StagedGroupBookmarkEditForm;

