import * as React from 'react';
import { withStyles, Theme, createStyles, Table, TableHead, TableRow, TableCell, TableBody } from '@material-ui/core';
import { User, Project } from '../types';
import { formatDuration } from '../tools';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export interface UserPaymentStat {
    spent: number,
    paid: number,
    user: User,
    ticking: boolean,
}

export type OwnProps = {
    id: number,
}

export type StateProps = {
    userStat: Array<UserPaymentStat>,
    project: Project,
}

const styles = ({ palette }: Theme) => createStyles({

});

export default withStyles(styles)(React.memo((props: OwnProps & StateProps) => {
    let {id, userStat, project} = props;

    const sum = {spent: 0, paid: 0, ticking: 0};

    return (
        <Table>
            <TableHead>
                <TableRow>
                    <TableCell>User</TableCell>
                    <TableCell>Spent</TableCell>
                    <TableCell>Paid</TableCell>
                    <TableCell>Balance</TableCell>
                    <TableCell>Working now?</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {userStat.filter(s => s.user).map(stat => <TableRow key={stat.user.id}>
                    <TableCell>{stat.user.name}</TableCell>
                    <TableCell>{formatDuration(stat.spent)}</TableCell>
                    <TableCell>{formatDuration(stat.paid)}</TableCell>
                    <TableCell>{formatDuration(stat.paid - stat.spent)}</TableCell>
                    <TableCell><FontAwesomeIcon icon={stat.ticking ? 'check' : 'times'}/></TableCell>
                </TableRow>)}
            </TableBody>
        </Table>
    )
}))
