import * as React from 'react';
import PabuTable from './PabuTable';
import { TableRowDesriptor, ExpandedPayment, ProjectInvitationToken } from '../types';
import { Button } from '@material-ui/core';

export type OwnProps = {
    id: number,
}

export type StateProps = {
    rows: Array<ProjectInvitationToken>,
}

export type DispatchProps = {
    onDelete: (entry: ProjectInvitationToken) => void,
    onCreateProjectToken: (projectId: number) => void,
}

export default React.memo((props: StateProps & DispatchProps & OwnProps) => {
    const {rows, onDelete, id, onCreateProjectToken} = props;

    const rowDescriptors = [
        new TableRowDesriptor('token' , 'Token'),
    ]

    const controllCellHeader = <div>
        <Button size="small" color="primary" onClick={onCreateProjectToken.bind(this, id)}>Generate</Button>
    </div>

    return <PabuTable rowDescriptors={rowDescriptors} rows={rows} onDelete={onDelete} controllCellHeader={controllCellHeader} />
})
