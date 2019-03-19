
import * as moment from 'moment';
import { connect } from 'react-redux';
import { Store, ThunkDispatcher, ExpandedTimeEntry, TableRowDesriptor } from '../types';
import { deleteTimeEntry, fetchProjects, openAddTimeDialog, startTime, stopTime } from '../actions';
import { formatDuration } from '../tools';
import TimeEntryList, {OwnProps, StateProps, DispatchProps} from '../components/TimeEntryList';

function mapStateToProps(state: Store, props: OwnProps) {
    const {issues, timeEntries, users, tickingStat} = state;

    let entries = [];
    for (const id in timeEntries) {
        const entry = timeEntries[id];
        if (entry.projectId != props.id)
            continue

        let exEntry: ExpandedTimeEntry = {
            ...entry,
            issueName: (entry.issueId in issues) ? issues[entry.issueId].name : '',
            userName: (entry.userId in users) ? users[entry.userId].name : '',
            spentHours: (entry.end || new Date().getTime()/1000) - entry.start,
        }
        entries.push(exEntry)
    }

    return {
        rows: entries,
        tickingStat
    }
}

const mapDispatchToProps = (dispatch: ThunkDispatcher) => {
    return {
        onDelete: (entry: ExpandedTimeEntry) => {
            if (confirm('Do you really want to delete this time entry?'))
                dispatch(deleteTimeEntry(entry.id)).then(() => dispatch(fetchProjects(entry.projectId)))
        },
        onAddNewTime: (projectId) => {
            dispatch(openAddTimeDialog(projectId))
        },
        onStartTime: (projectId: number) => {
            dispatch(startTime(projectId))
        },
        onStopTime: (openedProjectId: number) => {
            dispatch(stopTime(openedProjectId))
        },
    }
}

export default connect<StateProps, DispatchProps, OwnProps>(mapStateToProps, mapDispatchToProps)(TimeEntryList);
