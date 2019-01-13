import React, { SFC } from 'react';
import { connect } from 'react-redux';
import { AppState } from 'Store';
import { setLimitNumRendered } from 'Store/bookmarks/actions';
import { getNumFilteredUnrenderedBookmarks } from 'Store/selectors';
import ContentPage from './content';

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = UnwrapThunkActions<typeof mapDispatchToProps>;

type Props = StateProps & DispatchProps;

const ContentContainer: SFC<Props> = props => (
	<ContentPage
		onEnableLimitlessRender={props.setLimitNumBookmarksRendered.bind(null, false)}
		numRemainingBookmarks={props.numRemainingBookmarks}
		displayTutorialMessage={props.displayTutorialMessage}
	/>
);

const mapStateToProps = (state: AppState) => ({
	numRemainingBookmarks: getNumFilteredUnrenderedBookmarks(state),
	displayTutorialMessage: state.user.displayTutorialMessage,
});

const mapDispatchToProps = {
	setLimitNumBookmarksRendered: setLimitNumRendered,
};

export default connect(mapStateToProps, mapDispatchToProps)(ContentContainer);
