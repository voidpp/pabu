
import { connect } from 'react-redux';
import { Store, ThunkDispatcher, ExpandedTimeEntry } from '../types';
import TimeEntryList from '../components/TimeEntryList';

function mapStateToProps(state: Store) {
    const {issues, timeEntries, openedProjectId, users} = state;

    let entries = [];
    for (const id in timeEntries) {
        const entry = timeEntries[id];
        if (entry.projectId != openedProjectId)
            continue

        let exEntry: ExpandedTimeEntry = {
            ...entry,
            issueName: (entry.issueId in issues) ? issues[entry.issueId].name : '',
            userName: (entry.userId in users) ? users[entry.userId].name : '',
            spentHours: entry.end - entry.start,
        }
        entries.push(exEntry)
    }


    return {
        issues,
        entries,
    }
}

const mapDispatchToProps = (dispatch: ThunkDispatcher) => {
    return {
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(TimeEntryList);
