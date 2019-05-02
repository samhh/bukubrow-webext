import React, { FC } from 'react';
import mount from 'Modules/connected-mount';
import { connect, ConnectedComponentClass } from 'react-redux';
import styled from 'Styles';
import { AppState } from 'Store';
import { Page } from 'Store/user/types';
import { setPage } from 'Store/user/actions';
import { getStagedGroupToEdit } from 'Store/selectors';
import { formatStagedBookmarksGroupTitle } from 'Modules/bookmarks';

import BookmarkAddForm from 'Containers/bookmark-add-form/';
import BookmarkDeleteForm from 'Containers/bookmark-delete-form/';
import BookmarkEditForm from 'Containers/bookmark-edit-form/';
import ErrorMessages from 'Containers/error-messages/';
import OpenAllBookmarksConfirmation from 'Containers/open-all-bookmarks-confirmation/';
import Search from 'Containers/search/';
import StagedGroupBookmarkEditForm from 'Containers/staged-group-bookmark-edit-form/';
import StagedGroupBookmarksList from 'Containers/staged-group-bookmarks-list/';
import StagedGroupsList from 'Containers/staged-groups-list/';
import TitleMenu from 'Components/title-menu';

interface PageInfoSansTitleMenu {
	component: ConnectedComponentClass<any, any>; // eslint-disable-line @typescript-eslint/no-explicit-any
}

type PageInfo = {
	// Search page does not use title menu, all other pages do
	[K in Page]: K extends Page.Search
		? PageInfoSansTitleMenu
		: PageInfoSansTitleMenu & {
			nav: {
				title: string;
				exitTarget: Page;
			};
		};
};

const pageMap = (props: Props) => {
	const map: PageInfo = {
		[Page.Search]: {
			component: Search,
		},
		[Page.AddBookmark]: {
			nav: {
				title: 'Add Bookmark',
				exitTarget: Page.Search,
			},
			component: BookmarkAddForm,
		},
		[Page.EditBookmark]: {
			nav: {
				title: 'Edit Bookmark',
				exitTarget: Page.Search,
			},
			component: BookmarkEditForm,
		},
		[Page.StagedGroupsList]: {
			nav: {
				title: 'Staging Area',
				exitTarget: Page.Search,
			},
			component: StagedGroupsList,
		},
		[Page.StagedGroup]: {
			nav: {
				title: props.stagedGroupTitle.orDefault(''),
				exitTarget: Page.StagedGroupsList,
			},
			component: StagedGroupBookmarksList,
		},
		[Page.EditStagedBookmark]: {
			nav: {
				title: 'Edit Bookmark',
				exitTarget: Page.StagedGroup,
			},
			component: StagedGroupBookmarkEditForm,
		},
	};
	
	return map[props.page];
};

/**
 * Effectively sets minimum height for the page. This ensures that error
 * messages are always visible, and that the popup looks reasonable.
 */
const MinHeightWrapper = styled.main`
	min-height: 400px;
`;

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = UnwrapThunkActions<typeof mapDispatchToProps>;

type Props = StateProps & DispatchProps;

const ContentApp: FC<Props> = (props) => {
	const page = pageMap(props);
	
	return (
		<>
			<BookmarkDeleteForm />
			
			<OpenAllBookmarksConfirmation />
			
			<ErrorMessages />
			
			<MinHeightWrapper>
				{'nav' in page && (
					<TitleMenu
						title={page.nav.title}
						onBack={() => { page.nav && props.setPage(page.nav.exitTarget); }}
					/>
				)}

				<page.component />
			</MinHeightWrapper>
		</>
	);
};

const mapStateToProps = (state: AppState) => ({
	page: state.user.page,
	stagedGroupTitle: getStagedGroupToEdit(state).map(formatStagedBookmarksGroupTitle),
});

const mapDispatchToProps = { setPage };
	
const ConnectedContentApp = connect(mapStateToProps, mapDispatchToProps)(ContentApp);

mount(<ConnectedContentApp />);
	