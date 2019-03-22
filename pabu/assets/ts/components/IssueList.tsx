
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, createStyles, IconButton, Table, TableBody, TableCell, TableHead, TableRow, Theme, withStyles, Typography, Chip } from '@material-ui/core';
import * as React from 'react';
import StopWatch from '../containers/StopWatch';
import { Issue, TickingStat, TimeSummary, IssueStatus } from '../types';
import PabuTable, { TableColDesriptor } from './PabuTable';
import classNames from 'classnames';

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
    },
    menuBar: {
        marginTop: 10,
        display: 'flex',
        alignItems: 'center',
    },
    inactiveLayoutIcon: {
        opacity: 0.5,
    },
    filterChip: {
        marginLeft: 5,
        height: 26,
    },
});

type Props = StateProps & DispatchProps & OwnProps & MuiProps;

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


const IssueTableView = withStyles(styles)(React.memo((props: Props) => {
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

const IssueCardView = withStyles(styles)(React.memo((props: Props) => {
    let {issues, onAddNewTime, startTime, stopTime, tickingStat, onDeleteIssue, onUpdateIssue, onAddNewIssue, id, classes} = props;

    return <div></div>
}))

type IssueStatusFilterStatusMap = {
    [IssueStatus.TODO]: boolean,
    [IssueStatus.IN_PROGRESS]: boolean,
    [IssueStatus.DONE]: boolean,
}

type IssueStatusFilterBarProps = {
    value: IssueStatusFilterStatusMap,
    onChange: (value: {[s: string] : boolean}) => void,
}

const IssueStatusFilterBar = withStyles(styles)(React.memo((props: IssueStatusFilterBarProps & MuiProps) => {
    return <div style={{marginLeft: 10}}> {
            Object.values(IssueStatus).map(s => {
                return <Chip
                    className={props.classes.filterChip}
                    key={s}
                    label={s}
                    variant={props.value[s] ? 'default' : 'outlined'}
                    color="primary"
                    clickable
                    onClick={() => props.onChange({[s]: !props.value[s]})}
                />
            })
        } </div>
}))


type State = {
    layout: 'list' | 'card',
    statusFilters: IssueStatusFilterStatusMap,
}

class IssueList extends React.Component<Props, State> {

    constructor(props: Props){
        super(props)
        this.state = {
            layout: 'list',
            statusFilters: {
                [IssueStatus.TODO]: true,
                [IssueStatus.IN_PROGRESS]: true,
                [IssueStatus.DONE]: false,
            },
        }
    }

    render() {
        const {onAddNewIssue, id, classes} = this.props;
        const issues = this.props.issues.filter((i => this.state.statusFilters[i.status]))

        return <div>
            <div className={classes.menuBar}>
                <Button size="small" color="primary" onClick={onAddNewIssue.bind(this, id)} style={{marginRight: 10}}>Create issue</Button>
                <ActionIcon icon="list" onClick={() => this.setState({layout: 'list'})} className={this.state.layout == 'list' ? '' : classes.inactiveLayoutIcon}/>
                <ActionIcon icon="table" onClick={() => this.setState({layout: 'card'})} className={this.state.layout == 'card' ? '' : classes.inactiveLayoutIcon}/>
                <IssueStatusFilterBar value={this.state.statusFilters} onChange={value => this.setState({statusFilters: Object.assign(this.state.statusFilters, value)})} />
            </div>
            {this.state.layout == 'list' ? <IssueTableView {...this.props} issues={issues}/> : <IssueCardView {...this.props} />}
        </div>
    }
}

export default withStyles(styles)(IssueList);
