
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, createStyles, IconButton, Table, TableBody, TableCell, TableHead, TableRow, Theme, withStyles } from '@material-ui/core';
import * as React from 'react';
import StopWatch from '../containers/StopWatch';
import { Issue, TickingStat, TimeSummary } from '../types';
import PabuTable, { TableColDesriptor } from './PabuTable';

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


const IssueTableView = withStyles(styles)(React.memo((props: StateProps & DispatchProps & OwnProps & MuiProps) => {
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
    const spentRender = (stat: TimeSummary, issue: Issue) => <StopWatch projectId={issue.projectId} issueId={issue.id} initialValue={stat.spent} />;
    const spentSorting = (a: Issue, b: Issue) => a.timeStat.spent - b.timeStat.spent;

    const rowDescriptors = [
        new TableColDesriptor('name', 'Name'),
        new TableColDesriptor('desc', 'Description'),
        new TableColDesriptor('status', 'Status'),
        new TableColDesriptor('timeStat', 'Time spent', spentRender, spentSorting),
    ]
    const controllCellFactory = (issue: Issue) => <span>
        <ActionIcon icon="clock" onClick={onAddNewTime.bind(this, issue.projectId, issue.id)}/>
        {getTickingIcon(issue)}
        <ActionIcon icon="edit" onClick={onUpdateIssue.bind(this, issue.projectId, issue.id)}/>
        <ActionIcon icon="trash" onClick={onDeleteIssue.bind(this, issue.projectId, issue.id)}/>
    </span>

    return <PabuTable rows={issues} colDescriptors={rowDescriptors} controllCellFactory={controllCellFactory} defaultOrder="asc"/>
}))

const IssueCardView = withStyles(styles)(React.memo((props: StateProps & DispatchProps & OwnProps & MuiProps) => {
    let {issues, onAddNewTime, startTime, stopTime, tickingStat, onDeleteIssue, onUpdateIssue, onAddNewIssue, id, classes} = props;

    return <div></div>
}))


type State = {
    tableView: boolean
}

export default class IssueList extends React.Component<StateProps & DispatchProps & OwnProps, State> {
    state = {
        tableView: true,
    }

    render() {
        let {onAddNewIssue, id} = this.props;

        return <div>
            <Button size="small" color="primary" onClick={onAddNewIssue.bind(this, id)}>Create</Button>
            <IssueTableView {...this.props}/>
        </div>
    }
}
