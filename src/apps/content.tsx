import React, { FC } from 'react';
import * as O from 'fp-ts/lib/Option';
import mount from 'Modules/connected-mount';
import { useDispatch, useSelector } from 'Store';
import styled from 'Styles';
import { Page } from 'Store/user/types';
import { setPage } from 'Store/user/actions';
import { getStagedGroupToEdit } from 'Store/selectors';
import { formatStagedBookmarksGroupTitle } from 'Modules/bookmarks';

import BookmarkAddForm from 'Containers/bookmark-add-form';
import BookmarkDeleteForm from 'Containers/bookmark-delete-form';
import BookmarkEditForm from 'Containers/bookmark-edit-form';
import ErrorMessages from 'Containers/error-messages';
import OpenAllBookmarksConfirmation from 'Containers/open-all-bookmarks-confirmation';
import Search from 'Containers/search';
import StagedGroupBookmarkEditForm from 'Containers/staged-group-bookmark-edit-form';
import StagedGroupBookmarksList from 'Containers/staged-group-bookmarks-list';
import StagedGroupsList from 'Containers/staged-groups-list';
import TitleMenu from 'Components/title-menu';

interface PageInfoSansTitleMenu {
	component: FC;
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

interface PageMapArg {
	activePage: Page;
	stagedGroupTitle: Option<string>;
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const pageMap = ({ activePage, stagedGroupTitle }: PageMapArg) => {
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
				title: O.getOrElse(() => '')(stagedGroupTitle),
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

	return map[activePage];
};

/**
 * Effectively sets minimum height for the page. This ensures that error
 * messages are always visible, and that the popup looks reasonable.
 */
const MinHeightWrapper = styled.main`
	min-height: 400px;
`;

const ContentApp: FC = () => {
	const activePage = useSelector(state => state.user.page);
	const stagedGroupTitle = O.map(formatStagedBookmarksGroupTitle)(useSelector(getStagedGroupToEdit));
	const dispatch = useDispatch();

	const page = pageMap({ activePage, stagedGroupTitle });

	return (
		<>
			<BookmarkDeleteForm />

			<OpenAllBookmarksConfirmation />

			<ErrorMessages />

			<MinHeightWrapper>
				{'nav' in page && (
					<TitleMenu
						title={page.nav.title}
						onBack={(): void => void dispatch(setPage(page.nav.exitTarget))}
					/>
				)}

				<page.component />
			</MinHeightWrapper>
		</>
	);
};

mount(<ContentApp />)();

