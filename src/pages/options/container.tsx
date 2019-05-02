import React, { FC } from 'react';
import { connect } from 'react-redux';
import { AppState } from 'Store';
import { setActiveTheme } from 'Store/user/actions';
import OptionsPage from './options';

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = UnwrapThunkActions<typeof mapDispatchToProps>;

type Props = StateProps & DispatchProps;

const ContentContainer: FC<Props> = props => <OptionsPage {...props} />;

const mapStateToProps = (state: AppState) => ({ activeTheme: state.user.activeTheme });
const mapDispatchToProps = { setActiveTheme };

export default connect(mapStateToProps, mapDispatchToProps)(ContentContainer);

