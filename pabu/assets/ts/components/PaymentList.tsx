import * as React from 'react';
import PabuTable from './PabuTable';
import { TableRowDesriptor, ExpandedPayment } from '../types';
import moment = require('moment');
import { formatDuration } from '../tools';
import { Button } from '@material-ui/core';

export type OwnProps = {
    id: number,
}

export type StateProps = {
    rows: Array<ExpandedPayment>,
}

export type DispatchProps = {
    onDelete: (entry: ExpandedPayment) => void,
    onAddPayment: (projectId: number) => void,
}

export default React.memo((props: StateProps & DispatchProps & OwnProps) => {
    const {rows, onDelete, id, onAddPayment} = props;

    const rowDescriptors = [
        new TableRowDesriptor('time', 'Time', v => moment.unix(v).format('YYYY-MM-DD HH:mm')),
        new TableRowDesriptor('amount' , 'Amount', formatDuration),
        new TableRowDesriptor('createdUserName', 'Created'),
        new TableRowDesriptor('paidUserName', 'Paid'),
        new TableRowDesriptor('note', 'Note'),
    ]

    const controllCellHeader = <div>
        <Button size="small" color="primary" onClick={onAddPayment.bind(this, id)}>Add</Button>
    </div>

    return <PabuTable rowDescriptors={rowDescriptors} rows={rows} onDelete={onDelete} controllCellHeader={controllCellHeader} />
})
