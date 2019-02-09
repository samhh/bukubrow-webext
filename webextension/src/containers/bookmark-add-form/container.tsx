import React from 'react';
import { connect } from 'react-redux';
import { AppState } from 'Store';
import { setAddBookmarkModalDisplay } from 'Store/bookmarks/actions';
import { addBookmark } from 'Store/bookmarks/epics';
import BookmarkAddForm from './bookmark-add-form';

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = UnwrapThunkActions<typeof mapDispatchToProps>;

type Props = StateProps & DispatchProps;

const BookmarkAddFormContainer: Comp<Props> = props => (
	<BookmarkAddForm
		defaultTitle={props.pageTitle}
		defaultUrl={props.pageUrl}
		display={props.displayAddForm}
		onClose={props.setAddBookmarkModalDisplay.bind(null, false)}
		onSubmit={props.onSubmit}
	/>
);

const mapStateToProps = (state: AppState) => ({
	pageTitle: state.browser.pageTitle,
	pageUrl: state.browser.pageUrl,
	displayAddForm: state.bookmarks.displayAddBookmarkModal,
});

const mapDispatchToProps = ({
	setAddBookmarkModalDisplay,
	onSubmit: addBookmark,
});

export default connect(mapStateToProps, mapDispatchToProps)(BookmarkAddFormContainer);
