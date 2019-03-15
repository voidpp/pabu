
import * as React from 'react';
import { TimeEntry, IssueMap } from '../types';
import { Table, TableHead, TableCell, TableBody, TableRow, IconButton, Theme, createStyles, withStyles } from '@material-ui/core';

import * as moment from 'moment';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const styles = ({ palette, typography }: Theme) => createStyles({
    icon: {
        width: 35,
        height: 35,
    },
});

type Props = {
    entries: Array<TimeEntry>,
    issues: IssueMap,
    classes: any,
}

export default withStyles(createStyles(styles))(React.memo((props: Props) => {
    return <Table>
        <TableHead>
            <TableRow>
                <TableCell>Start</TableCell>
                <TableCell>Length</TableCell>
                <TableCell>Issue</TableCell>
                <TableCell></TableCell>
            </TableRow>
        </TableHead>
        <TableBody>{
            props.entries.map(entry => <TableRow key={entry.id}>
                <TableCell>{moment.unix(entry.start).format('YYYY-MM-DD HH:mm')}</TableCell>
                <TableCell>{((entry.end - entry.start)/3600).toFixed(2)} hours</TableCell>
                <TableCell>{entry.issueId ? props.issues[entry.issueId].name : ''}</TableCell>
                <TableCell>
                    <IconButton className={props.classes.icon}>
                        <FontAwesomeIcon icon="trash" style={{fontSize: 12}}/>
                    </IconButton>
                </TableCell>
            </TableRow>)
        }</TableBody>
    </Table>
}));
