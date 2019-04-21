import React from 'react';
import { connect } from 'react-redux';
import { Just } from 'purify-ts/Maybe';
import { AppState } from 'Store';
import { setStagedBookmarksGroupBookmarkEditId } from 'Store/bookmarks/actions';
import { setPage } from 'Store/user/actions';
import { Page } from 'Store/user/types';
import { getStagedGroupToEditWeightedBookmarks } from 'Store/selectors';
import StagedGroupBookmarksList from './staged-group-bookmarks-list';
import { deleteStagedBookmarksGroupBookmarkOrEntireGroup, openBookmarkAndExit } from 'Store/epics';

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = UnwrapThunkActions<typeof mapDispatchToProps>;

type Props = StateProps & DispatchProps;

const BookmarksListContainer: Comp<Props> = props => (
	<StagedGroupBookmarksList
		bookmarks={props.bookmarks}
		onOpenBookmark={(bmId: LocalBookmark['id']) => {
			props.onOpenBookmark(bmId, props.stagedGroupId);
		}}
		onEditBookmark={(id) => {
			props.onEditBookmark(Just(id));
			props.setPage(Page.EditStagedBookmark);
		}}
		onDeleteBookmark={(id) => {
			props.stagedGroupId.ifJust((grpId) => {
				props.onDeleteBookmark(grpId, id);
			});
		}}
	/>
);

const mapStateToProps = (state: AppState) => ({
	stagedGroupId: state.bookmarks.stagedBookmarksGroupEditId,
	bookmarks: getStagedGroupToEditWeightedBookmarks(state).orDefault([]),
});

const mapDispatchToProps = ({
	setPage,
	onOpenBookmark: openBookmarkAndExit,
	onEditBookmark: setStagedBookmarksGroupBookmarkEditId,
	onDeleteBookmark: deleteStagedBookmarksGroupBookmarkOrEntireGroup,
});

export default connect(mapStateToProps, mapDispatchToProps)(BookmarksListContainer);
