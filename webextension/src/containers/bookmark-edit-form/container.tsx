import React from 'react';
import { connect } from 'react-redux';
import { AppState } from 'Store';
import { setEditBookmarkModalDisplay } from 'Store/bookmarks/actions';
import { updateBookmark } from 'Store/bookmarks/epics';
import { getBookmarkToEdit } from 'Store/selectors';
import BookmarkEditForm from './bookmark-edit-form';

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = UnwrapThunkActions<typeof mapDispatchToProps>;

type Props = StateProps & DispatchProps;

const BookmarkEditFormContainer: Comp<Props> = props => (
	<BookmarkEditForm
		bookmark={props.bookmarkToEdit}
		display={props.displayEditForm}
		onClose={props.setEditBookmarkModalDisplay.bind(null, false)}
		onSubmit={props.onSubmit}
	/>
);

const mapStateToProps = (state: AppState) => ({
	bookmarkToEdit: getBookmarkToEdit(state),
	displayEditForm: state.bookmarks.displayEditBookmarkModal,
});

const mapDispatchToProps = ({
	setEditBookmarkModalDisplay,
	onSubmit: updateBookmark,
});

export default connect(mapStateToProps, mapDispatchToProps)(BookmarkEditFormContainer);
