import React, { FC } from 'react';
import { connect } from 'react-redux';
import { AppState } from 'Store';
import { Page } from 'Store/user/types';
import { setPage } from 'Store/user/actions';
import { getSortedStagedGroups } from 'Store/selectors';
import StagedGroupsList from './staged-groups-list';
import { setStagedBookmarksGroupEditId } from 'Store/bookmarks/actions';
import { Just } from 'purify-ts/Maybe';

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = UnwrapThunkActions<typeof mapDispatchToProps>;

type Props = StateProps & DispatchProps;

const SearchContainer: FC<Props> = props => (
	<StagedGroupsList
		stagedGroups={props.groups}
		onGroupClick={(id) => {
			props.setGroup(Just(id));
			props.setPage(Page.StagedGroup);
		}}
		exit={props.setPage.bind(null, Page.Search)}
	/>
);

const mapStateToProps = (state: AppState) => ({
	groups: getSortedStagedGroups(state),
});

const mapDispatchToProps = {
	setGroup: setStagedBookmarksGroupEditId,
	setPage,
};

export default connect(mapStateToProps, mapDispatchToProps)(SearchContainer);
