
import * as React from 'react';
import { TickingStat, Issue } from '../types';
import { Table, TableHead, TableRow, TableCell, TableBody, withStyles, Theme, createStyles, IconButton, Button } from '@material-ui/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { formatDuration } from '../tools';
import StopWatch from '../containers/StopWatch';

export type StateProps = {
    issues: Array<Issue>,
    tickingStat: TickingStat,
}

export type DispatchProps = {
    onAddNewIssue: (projectId: number) => void,
    onAddNewTime: (projectId: number, issueId: number) => void,
    onDeleteIssue: (projectId: number, issueId: number) => void,
    onUpdateIssue: (projectId: number, issueId: number) => void,
    startTime: (projectId: number, issueId: number) => void,
    stopTime: (projectId: number) => void,
}


export type OwnProps = {
    id: number,
}

type MuiProps = {
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
    stopIcon: {
        color: palette.secondary.main,
    }
});

type ActionIconProps = {
    icon: IconProp,
    classes: any,
    onClick?: () => void, disabled?: boolean,
    className?: string,
}

const ActionIcon = withStyles(styles)(React.memo((props: ActionIconProps) => {
    const {icon, classes, onClick, disabled} = props;
    return (
        <IconButton className={classes.iconButton} onClick={onClick} disabled={disabled}>
            <FontAwesomeIcon icon={icon} className={classes.icon + (props.className ? (' ' + props.className) : '')} />
        </IconButton>
    )
}));

export default withStyles(styles)(React.memo((props: StateProps & DispatchProps & OwnProps & MuiProps) => {
    let {issues, onAddNewTime, startTime, stopTime, tickingStat, onDeleteIssue, onUpdateIssue, onAddNewIssue, id, classes} = props;

    function getTickingIcon(issue: Issue) {
        if (tickingStat.ticking) {
            if (tickingStat.entry.issueId == issue.id)
                return <ActionIcon icon="stopwatch" onClick={stopTime.bind(this, issue.projectId)} className={classes.stopIcon} />
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
                    <TableCell>
                        <Button size="small" color="primary" onClick={onAddNewIssue.bind(this, id)}>Create</Button>
                    </TableCell>
                </TableRow>
            </TableHead>
            <TableBody>{
                issues.map(issue => <TableRow key={issue.id}>
                    <TableCell>{issue.name}</TableCell>
                    <TableCell>{issue.desc}</TableCell>
                    {/* <TableCell>{formatDuration(issue.timeStat.spent)}</TableCell> */}
                    <TableCell>
                        <StopWatch
                            projectId={issue.projectId}
                            issueId={issue.id}
                            initialValue={issue.timeStat.spent}
                            />
                        </TableCell>
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
