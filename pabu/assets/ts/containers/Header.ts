
import { connect } from 'react-redux';
import Header, {StateProps, DispatchProps, OwnProps} from '../components/Header';
import { Store, ThunkDispatcher } from '../types';
import { stopTime, setDarkTheme } from '../actions';

const mapStateToProps = (state: Store) => {
    const {tickingStat, isDarkTheme, projects, issues } = state;

    return {
        tickingStat,
        isDarkTheme,
        projects,
        issues,
    }
}

const mapDispatchToProps = (dispatch: ThunkDispatcher) => {
    return {
        onStopTime: (projectId: number) => {
            dispatch(stopTime(projectId))
        },
        onThemeClick: (isDark: boolean) => {
            dispatch(setDarkTheme(isDark))
        },
    }
}

export default connect<StateProps, DispatchProps, OwnProps>(mapStateToProps, mapDispatchToProps)(Header)
