import React, { FC } from 'react';
import { connect } from 'react-redux';
import { AppState } from 'Store';
import { addBookmark } from 'Store/bookmarks/epics';
import BookmarkAddForm from './bookmark-add-form';

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = UnwrapThunkActions<typeof mapDispatchToProps>;

type Props = StateProps & DispatchProps;

const BookmarkAddFormContainer: FC<Props> = props => (
	<BookmarkAddForm
		defaultTitle={props.pageTitle}
		defaultUrl={props.pageUrl}
		onSubmit={props.onSubmit}
	/>
);

const mapStateToProps = (state: AppState) => ({
	pageTitle: state.browser.pageTitle,
	pageUrl: state.browser.pageUrl,
});

const mapDispatchToProps = ({
	onSubmit: addBookmark,
});

export default connect(mapStateToProps, mapDispatchToProps)(BookmarkAddFormContainer);
