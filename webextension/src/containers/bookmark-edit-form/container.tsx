import React, { FC } from 'react';
import { connect } from 'react-redux';
import { AppState } from 'Store';
import { updateBookmark } from 'Store/bookmarks/epics';
import { getBookmarkToEdit } from 'Store/selectors';
import BookmarkEditForm from './bookmark-edit-form';

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = UnwrapThunkActions<typeof mapDispatchToProps>;

type Props = StateProps & DispatchProps;

const BookmarkEditFormContainer: FC<Props> = props => (
	<BookmarkEditForm
		bookmark={props.bookmarkToEdit}
		onSubmit={props.onSubmit}
	/>
);

const mapStateToProps = (state: AppState) => ({
	bookmarkToEdit: getBookmarkToEdit(state),
});

const mapDispatchToProps = ({
	onSubmit: updateBookmark,
});

export default connect(mapStateToProps, mapDispatchToProps)(BookmarkEditFormContainer);
