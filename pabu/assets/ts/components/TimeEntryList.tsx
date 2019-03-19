import * as React from 'react';
import PabuTable from './PabuTable';
import { PabuModel, TableRowDesriptor, ExpandedTimeEntry, TickingStat } from '../types';
import moment = require('moment');
import { formatDuration } from '../tools';
import { Button } from '@material-ui/core';

export type OwnProps = {
    id: number,
}

export type StateProps = {
    rows: Array<PabuModel>,
    tickingStat: TickingStat,
}

export type DispatchProps = {
    onDelete: (entry: ExpandedTimeEntry) => void,
    onAddNewTime: (projectId: number) => void,
    onStartTime: (projectId: number) => void,
    onStopTime: (projectId: number) => void,
}

export default React.memo((props: StateProps & DispatchProps & OwnProps) => {
    const {tickingStat, rows, onDelete, onAddNewTime, onStartTime, onStopTime, id} = props;

    const rowDescriptors = [
        new TableRowDesriptor('start', 'Start', v => moment.unix(v).format('YYYY-MM-DD HH:mm')),
        new TableRowDesriptor('spentHours' , 'Length', formatDuration),
        new TableRowDesriptor('issueName', 'Issue'),
        new TableRowDesriptor('userName', 'User'),
    ]

    let tickingButton = <Button size="small" disabled>Start</Button>;
    if (tickingStat.ticking) {
        if (tickingStat.entry.projectId == id)
            tickingButton = <Button size="small" color="secondary" variant="contained" onClick={onStopTime.bind(this, id)}>Stop</Button>
    } else
        tickingButton = <Button size="small" color="primary" onClick={onStartTime.bind(this, id)}>Start</Button>

    const controllCellHeader = <div>
        {tickingButton}
        <Button size="small" color="primary" onClick={onAddNewTime.bind(this, id)}>Add</Button>
    </div>

    return <PabuTable rowDescriptors={rowDescriptors} rows={rows} onDelete={onDelete} controllCellHeader={controllCellHeader} />
})
