import React, { FC } from 'react';
import * as O from 'fp-ts/lib/Option';
import mount from '~/modules/connected-mount';
import { useDispatch, useSelector } from '~/store';
import styled from '~/styles';
import { Page, commsL } from '~/store/user/types';
import { setPage } from '~/store/user/actions';
import { getStagedGroupToEdit } from '~/store/selectors';
import { formatStagedBookmarksGroupTitle } from '~/modules/bookmarks';
import { runIO } from '~/modules/fp';
import { HostVersionCheckResult } from '~/modules/comms/native';

import BookmarkAddForm from '~/containers/bookmark-add-form';
import BookmarkDeleteForm from '~/containers/bookmark-delete-form';
import BookmarkEditForm from '~/containers/bookmark-edit-form';
import ErrorMessages from '~/containers/error-messages';
import Onboarding from '~/components/onboarding';
import OpenAllBookmarksConfirmation from '~/containers/open-all-bookmarks-confirmation';
import Search from '~/containers/search';
import StagedGroupBookmarkEditForm from '~/containers/staged-group-bookmark-edit-form';
import StagedGroupBookmarksList from '~/containers/staged-group-bookmarks-list';
import StagedGroupsList from '~/containers/staged-groups-list';
import TitleMenu from '~/components/title-menu';

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
	const comms = useSelector(commsL.get);
	const activePage = useSelector(state => state.user.page);
	const stagedGroupTitle = O.map(formatStagedBookmarksGroupTitle)(useSelector(getStagedGroupToEdit));
	const dispatch = useDispatch();

	const displayOnboarding = comms === HostVersionCheckResult.NoComms;

	const page = pageMap({ activePage, stagedGroupTitle });

	return (
		<>
			<BookmarkDeleteForm />

			<OpenAllBookmarksConfirmation />

			{!displayOnboarding && <ErrorMessages />}

			<MinHeightWrapper>
				{displayOnboarding ? (
					<Onboarding />
				) : (
					<>
						{'nav' in page && (
							<TitleMenu
								title={page.nav.title}
								onBack={(): void => void dispatch(setPage(page.nav.exitTarget))}
							/>
						)}

						<page.component />

					</>
				)}
			</MinHeightWrapper>
		</>
	);
};

runIO(mount(<ContentApp />));

