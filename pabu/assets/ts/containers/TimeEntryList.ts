
import * as moment from 'moment';
import { connect } from 'react-redux';
import { Store, ThunkDispatcher, ExpandedTimeEntry, TableRowDesriptor } from '../types';
import { deleteTimeEntry, fetchProjects } from '../actions';
import PabuTable from '../components/PabuTable';
import { formatDuration } from '../tools';

function mapStateToProps(state: Store, props: {id: number}) {
    const {issues, timeEntries, users} = state;

    let entries = [];
    for (const id in timeEntries) {
        const entry = timeEntries[id];
        if (entry.projectId != props.id)
            continue

        let exEntry: ExpandedTimeEntry = {
            ...entry,
            issueName: (entry.issueId in issues) ? issues[entry.issueId].name : '',
            userName: (entry.userId in users) ? users[entry.userId].name : '',
            spentHours: entry.end - entry.start,
        }
        entries.push(exEntry)
    }

    const rowDescriptors = [
        new TableRowDesriptor('start', 'Start', v => moment.unix(v).format('YYYY-MM-DD HH:mm')),
        new TableRowDesriptor('spentHours' , 'Length', formatDuration),
        new TableRowDesriptor('issueName', 'Issue'),
        new TableRowDesriptor('userName', 'User'),
    ]

    return {
        rows: entries,
        rowDescriptors,
    }
}

const mapDispatchToProps = (dispatch: ThunkDispatcher) => {
    return {
        onDelete: (entry: ExpandedTimeEntry) => {
            if (confirm('Do you really want to delete this time entry?'))
                dispatch(deleteTimeEntry(entry.id)).then(() => dispatch(fetchProjects(entry.projectId)))
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(PabuTable);
