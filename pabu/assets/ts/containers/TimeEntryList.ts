
import { connect } from 'react-redux';
import { Store, ThunkDispatcher } from '../types';
import TimeEntryList from '../components/TimeEntryList';

function mapStateToProps(state: Store) {
    const {issues} = state;
    return {
        issues
    }
}

const mapDispatchToProps = (dispatch: ThunkDispatcher) => {
    return {
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(TimeEntryList);
