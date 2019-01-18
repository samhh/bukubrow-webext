import React, { SFC } from 'react';
import { connect } from 'react-redux';
import { AppState } from 'Store';
import { setDeleteBookmarkModalDisplay } from 'Store/bookmarks/actions';
import { deleteBookmark } from 'Store/bookmarks/epics';
import { getBookmarkToDelete } from 'Store/selectors';
import BookmarkDeleteForm from './bookmark-delete-form';

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = UnwrapThunkActions<typeof mapDispatchToProps>;

type Props = StateProps & DispatchProps;

const BookmarkDeleteFormContainer: SFC<Props> = props => props.bookmarkToDelete && (
	<BookmarkDeleteForm
		bookmark={props.bookmarkToDelete}
		display={props.displayDeleteForm}
		onCancel={props.setDeleteBookmarkModalDisplay.bind(null, false)}
		onConfirm={props.onSubmit}
	/>
) || null;

const mapStateToProps = (state: AppState) => ({
	bookmarkToDelete: getBookmarkToDelete(state),
	displayDeleteForm: state.bookmarks.displayDeleteBookmarkModal,
});

const mapDispatchToProps = ({
	setDeleteBookmarkModalDisplay,
	onSubmit: deleteBookmark,
});

export default connect(mapStateToProps, mapDispatchToProps)(BookmarkDeleteFormContainer);
