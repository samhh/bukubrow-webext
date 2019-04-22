import React from 'react';
import { connect } from 'react-redux';
import { AppState } from 'Store';
import StagedGroupBookmarkEditForm from './staged-group-bookmark-edit-form';
import { getStagedGroupBookmarkToEdit } from 'Store/selectors';
import { updateStagedBookmarksGroupBookmark } from 'Store/bookmarks/actions';
import { setPage } from 'Store/user/actions';
import { Page } from 'Store/user/types';

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = UnwrapThunkActions<typeof mapDispatchToProps>;

type Props = StateProps & DispatchProps;

const StagedGroupBookmarkEditFormContainer: Comp<Props> = props => (
	<StagedGroupBookmarkEditForm
		bookmark={props.bookmarkToEdit}
		onExit={() => {
			props.setPage(Page.StagedGroup);
		}}
		onSubmit={(bm) => {
			props.groupEditId.ifJust((grpId) => {
				props.onSubmit(grpId, bm);
				props.setPage(Page.StagedGroup);
			});
		}}
	/>
);

const mapStateToProps = (state: AppState) => ({
	bookmarkToEdit: getStagedGroupBookmarkToEdit(state),
	groupEditId: state.bookmarks.stagedBookmarksGroupEditId,
});

const mapDispatchToProps = ({
	setPage,
	onSubmit: updateStagedBookmarksGroupBookmark,
});

export default connect(mapStateToProps, mapDispatchToProps)(StagedGroupBookmarkEditFormContainer);
