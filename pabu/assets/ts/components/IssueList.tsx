
import * as React from 'react';
import { IssueMap, TickingStat, Issue } from '../types';
import IssueRow from '../components/IssueRow';
import { Table, TableHead, TableRow, TableCell, TableBody, withStyles, Theme, createStyles, IconButton } from '@material-ui/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';

type Props = {
    issues: Array<Issue>,
    onAddNewTime: (projectId: number, issueId: number) => void,
    onDeleteIssue: (projectId: number, issueId: number) => void,
    onUpdateIssue: (projectId: number, issueId: number) => void,
    startTime: (projectId: number, issueId: number) => void,
    stopTime: (projectId: number) => void,
    tickingStat: TickingStat,
    classes: any,
}

const styles = ({ palette, typography }: Theme) => createStyles({
    iconButton: {
        width: 35,
        height: 35,
        padding: 5,
    },
    icon: {
        fontSize: 17,
    },
});

const ActionIcon = withStyles(styles)(React.memo((props: {icon: IconProp, classes: any, onClick?: () => void, disabled?: boolean}) => {
    const {icon, classes, onClick, disabled} = props;
    return (
        <IconButton className={classes.iconButton} onClick={onClick} disabled={disabled}>
            <FontAwesomeIcon icon={icon} className={classes.icon} />
        </IconButton>
    )
}));

export default withStyles(styles)(React.memo((props: Props) => {
    let {issues, onAddNewTime, startTime, stopTime, tickingStat, onDeleteIssue, onUpdateIssue} = props;

    function getTickingIcon(issue: Issue) {
        if (tickingStat.ticking) {
            if (tickingStat.entry.issueId == issue.id)
                return <ActionIcon icon="stopwatch" onClick={stopTime.bind(this, issue.projectId)} />
            else
                return <ActionIcon icon="stopwatch" disabled/>
        } else
            return <ActionIcon icon="stopwatch" onClick={startTime.bind(this, issue.projectId, issue.id)} />
    }

    return (
        <Table>
            <TableHead>
                <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell>Time spent</TableCell>
                    <TableCell></TableCell>
                </TableRow>
            </TableHead>
            <TableBody>{
                issues.map(issue => <TableRow key={issue.id}>
                    <TableCell>{issue.name}</TableCell>
                    <TableCell>{issue.desc}</TableCell>
                    <TableCell>{(issue.timeStat.spent/3600).toFixed(2)} hours</TableCell>
                    <TableCell>
                        <ActionIcon icon="clock" onClick={onAddNewTime.bind(this, issue.projectId, issue.id)}/>
                        {getTickingIcon(issue)}
                        <ActionIcon icon="edit" onClick={onUpdateIssue.bind(this, issue.projectId, issue.id)}/>
                        <ActionIcon icon="trash" onClick={onDeleteIssue.bind(this, issue.projectId, issue.id)}/>
                    </TableCell>
                </TableRow>)
            }</TableBody>
        </Table>
    )
}))
