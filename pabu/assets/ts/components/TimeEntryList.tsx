import * as React from 'react';
import PabuTable, {TableColDesriptor} from './PabuTable';
import { PabuModel, ExpandedTimeEntry, TickingStat, TimeEntry } from '../types';
import moment = require('moment');
import { formatDuration } from '../tools';
import { Button } from '@material-ui/core';
import StopWatch from '../containers/StopWatch';

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
    onStopTime: () => void,
}

export default React.memo((props: StateProps & DispatchProps & OwnProps) => {
    const {tickingStat, rows, onDelete, onAddNewTime, onStartTime, onStopTime, id} = props;

    const lengthFormatter = (v: number, entry: TimeEntry) => entry.end ? formatDuration(v) : <StopWatch projectId={id} initialValue={v} />

    const rowDescriptors = [
        new TableColDesriptor('start', 'Start', v => moment.unix(v).format('YYYY-MM-DD HH:mm')),
        new TableColDesriptor('spentHours' , 'Length', lengthFormatter),
        new TableColDesriptor('issueName', 'Issue'),
        new TableColDesriptor('userName', 'User'),
    ]

    let tickingButton = <Button size="small" disabled>Start</Button>;
    if (tickingStat.ticking) {
        if (tickingStat.entry.projectId == id)
            tickingButton = <Button size="small" color="secondary" variant="contained" onClick={onStopTime}>Stop</Button>
    } else
        tickingButton = <Button size="small" color="primary" onClick={onStartTime.bind(this, id)}>Start</Button>

    const controllCellHeader = <div>
        {tickingButton}
        <Button size="small" color="primary" onClick={onAddNewTime.bind(this, id)}>Add</Button>
    </div>

    return <PabuTable colDescriptors={rowDescriptors} rows={rows} onDelete={onDelete} controllCellHeader={controllCellHeader} />
})
