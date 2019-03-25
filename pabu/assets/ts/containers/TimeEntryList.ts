
import { connect } from 'react-redux';
import { deleteTimeEntry, fetchProjects, openAddTimeDialog, startTime, stopTime } from '../actions';
import TimeEntryList, { DispatchProps, OwnProps, StateProps } from '../components/TimeEntryList';
import { ExpandedTimeEntry, Store, ThunkDispatcher } from '../types';

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
        onStopTime: () => {
            dispatch(stopTime())
        },
    }
}

export default connect<StateProps, DispatchProps, OwnProps>(mapStateToProps, mapDispatchToProps)(TimeEntryList);
