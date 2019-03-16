import React from 'react';
import mount from 'Modules/connected-mount';
import { connect } from 'react-redux';
import { AppState } from 'Store';
import { Page } from 'Store/user/types';

import BookmarkAddForm from 'Containers/bookmark-add-form/';
import BookmarkDeleteForm from 'Containers/bookmark-delete-form/';
import BookmarkEditForm from 'Containers/bookmark-edit-form/';
import ErrorMessages from 'Containers/error-messages/';
import OpenAllBookmarksConfirmation from 'Containers/open-all-bookmarks-confirmation/';

import ContentPage from 'Pages/content/';

// TODO better latter type
const pageMap: Record<Page, typeof ContentPage> = {
	[Page.Search]: ContentPage,
};

const mapStateToProps = (state: AppState) => ({ page: state.user.page });
type Props = ReturnType<typeof mapStateToProps>;

const ContentApp: Comp<Props> = (props) => {
	const Page = pageMap[props.page];
	
	return (
		<>
			<BookmarkAddForm />
			<BookmarkEditForm />
			<BookmarkDeleteForm />
			
			<OpenAllBookmarksConfirmation />
			
			<ErrorMessages />
			
			<Page />
		</>
	);
};
	
const ConnectedContentApp = connect(mapStateToProps)(ContentApp);
mount(<ConnectedContentApp />);
	