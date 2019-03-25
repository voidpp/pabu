
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Chip, createStyles, IconButton, Theme, withStyles } from '@material-ui/core';
import * as React from 'react';
import IssueCardView from '../containers/IssueCardView';
import StopWatch from '../containers/StopWatch';
import { pabuLocalStorage, removeKeys } from '../tools';
import { Issue, IssueListLayout, IssueStatus, IssueStatusFilterStatusMap, TickingStat, TimeSummary } from '../types';
import PabuTable, { TableColDesriptor } from './PabuTable';
import ActionIcon from './ActionIcon';
import IssueActionIcons from './IssueActionIcons';

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

const styles = ({ palette }: Theme) => createStyles({
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

const IssueTableView = React.memo((props: Props) => {
    let {issues} = props;

    const spentRender = (stat: TimeSummary, issue: Issue) => <StopWatch projectId={issue.projectId} issueId={issue.id} initialValue={stat.spent} />;
    const spentSorting = (a: Issue, b: Issue) => a.timeStat.spent - b.timeStat.spent;

    const rowDescriptors = [
        new TableColDesriptor('name', 'Name').setStyle({maxWidth: 300, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis'}),
        new TableColDesriptor('desc', 'Description'),
        new TableColDesriptor('status', 'Status'),
        new TableColDesriptor('timeStat', 'Time spent', spentRender, spentSorting),
    ]
    const controllCellFactory = (issue: Issue) => <IssueActionIcons issue={issue} {...props} />

    return <PabuTable rows={issues} colDescriptors={rowDescriptors} controllCellFactory={controllCellFactory} defaultOrder="asc"/>
})

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
    layout: IssueListLayout,
    statusFilters: IssueStatusFilterStatusMap,
}

class IssueList extends React.Component<Props, State> {

    constructor(props: Props){
        super(props)
        this.state = {
            layout: pabuLocalStorage.issueListLayout,
            statusFilters: pabuLocalStorage.issueTableFilters,
        }
    }

    private changeLayout(layout: IssueListLayout) {
        this.setState({layout});
        pabuLocalStorage.issueListLayout = layout;
    }

    private changeFilter(value: {[s: string] : boolean}) {
        const statusFilters = Object.assign(this.state.statusFilters, value);
        this.setState({statusFilters});
        pabuLocalStorage.issueTableFilters = statusFilters;
    }

    render() {
        const {onAddNewIssue, id, classes} = this.props;
        const issues = this.props.issues.filter((i => this.state.statusFilters[i.status]))

        return <div>
            <div className={classes.menuBar}>
                <Button size="small" color="primary" onClick={onAddNewIssue.bind(this, id)} style={{marginRight: 10}}>Create issue</Button>
                <ActionIcon icon="list" onClick={() => this.changeLayout('list')} className={this.state.layout == 'list' ? '' : classes.inactiveLayoutIcon}/>
                <ActionIcon icon="table" onClick={() => this.changeLayout('card')} className={this.state.layout == 'card' ? '' : classes.inactiveLayoutIcon}/>
                {this.state.layout == 'list' ? <IssueStatusFilterBar value={this.state.statusFilters} onChange={this.changeFilter.bind(this)} /> : null}

            </div>
            {this.state.layout == 'list' ? <IssueTableView {...this.props} issues={issues}/> : <IssueCardView id={id} {...removeKeys<Props>(this.props, 'classes')}/>}
        </div>
    }
}

export default withStyles(styles)(IssueList);
