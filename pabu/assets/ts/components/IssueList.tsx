
import { Button, Chip, createStyles, Theme, withStyles, Typography, Link } from '@material-ui/core';
import * as React from 'react';
import IssueCardView from '../containers/IssueCardView';
import StopWatch from '../containers/StopWatch';
import { pabuLocalStorage, removeKeys } from '../tools';
import { Issue, IssueListLayout, IssueStatus, IssueStatusFilterStatusMap, TickingStat, TimeSummary, TagMap, Tag } from '../types';
import ActionIcon from './ActionIcon';
import DurationSelect from './DurationSelect';
import IssueActionIcons from './IssueActionIcons';
import PabuTable, { TableColDesriptor } from './PabuTable';
import MultiSelect from './MultiSelect';

export type StateProps = {
    issues: Array<Issue>,
    tickingStat: TickingStat,
    tags: TagMap,
}

export type DispatchProps = {
    onAddNewIssue: (projectId: number) => void,
    onAddNewTime: (projectId: number, issueId: number) => void,
    onDeleteIssue: (projectId: number, issueId: number) => void,
    onUpdateIssue: (projectId: number, issueId: number) => void,
    startTime: (projectId: number, issueId: number) => void,
    stopTime: () => void,
    showIssue: (id: number) => void,
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
    let {issues, showIssue} = props;

    const spentRender = (stat: TimeSummary, issue: Issue) => <StopWatch projectId={issue.projectId} issueId={issue.id} initialValue={stat.spent} />;
    const spentSorting = (a: Issue, b: Issue) => a.timeStat.spent - b.timeStat.spent;

    const rowDescriptors = [
        new TableColDesriptor('id', 'Id', id => <Link style={{cursor: 'pointer'}} onClick={() => showIssue(id)}>#{id}</Link>),
        new TableColDesriptor('name', 'Summary').setStyle({maxWidth: 400, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis'}),
        new TableColDesriptor('status', 'Status'),
        new TableColDesriptor('timeStat', 'Time spent', spentRender, spentSorting),
    ]
    const controllCellFactory = (issue: Issue) => <IssueActionIcons issue={issue} {...removeKeys<Props>(props, 'classes')} />

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
    doneDateFilter: number,
    tagFilter: Array<number>,
}

class IssueList extends React.Component<Props, State> {

    constructor(props: Props){
        super(props)
        this.state = {
            layout: pabuLocalStorage.issueListLayout,
            statusFilters: pabuLocalStorage.issueTableFilters,
            doneDateFilter: pabuLocalStorage.issueDoneDateFilter,
            tagFilter: pabuLocalStorage.issueTagFilter,
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

    private changeDoneDateFilter = (value: number) => {
        this.setState({doneDateFilter: value});
        pabuLocalStorage.issueDoneDateFilter = value;
    }

    private changeTagFilter = (tagFilter: Array<number>) => {
        this.setState({tagFilter});
        pabuLocalStorage.issueTagFilter = tagFilter;
    }

    render() {
        // TODO: issue filtering implemented twice, once for IssueCardView and once for IssueTableView... merge them!
        const {onAddNewIssue, id, classes} = this.props;
        const {layout, statusFilters, doneDateFilter, tagFilter} = this.state;
        let issues = this.props.issues.filter((i => statusFilters[i.status]))
        if (tagFilter.length) {
            issues = issues.filter(i => i.tags.filter(id => tagFilter.includes(id)).length == tagFilter.length)
        }
        const filter = layout == 'list' ?
                <IssueStatusFilterBar value={statusFilters} onChange={this.changeFilter.bind(this)} /> :
                <div style={{marginLeft: 10, display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                    <Typography style={{paddingRight: 5}}>Hide 'Done' tasks older than: </Typography>
                    <DurationSelect value={doneDateFilter} onChange={this.changeDoneDateFilter} />
                </div>;

        return <div>
            <div className={classes.menuBar}>
                <Button size="small" color="primary" onClick={onAddNewIssue.bind(this, id)} style={{marginRight: 10}}>Create task</Button>
                <ActionIcon data-tip="List view" icon="list" onClick={() => this.changeLayout('list')} className={layout == 'list' ? '' : classes.inactiveLayoutIcon}/>
                <ActionIcon data-tip="Card view" icon="table" onClick={() => this.changeLayout('card')} className={layout == 'card' ? '' : classes.inactiveLayoutIcon}/>
                {filter}
                <div style={{marginLeft: 20, flexGrow: 1}}>
                    <MultiSelect
                        placeholder="Filter by tags..."
                        options={Object.values(this.props.tags).map(t => ({label: t.name, value: t.id}))}
                        values={tagFilter.map(id => ({value: id, label: this.props.tags[id].name}))}
                        onChange={v => this.changeTagFilter(v.map(v => v.value))}
                    />
                 </div>
            </div>
            {layout == 'list' ?
                <IssueTableView {...this.props} issues={issues}/> :
                <IssueCardView
                    tagFilter={tagFilter}
                    doneDateFilter={doneDateFilter}
                    projectId={id}
                    setTagFilter={id => this.changeTagFilter([id])}
                    {...removeKeys<Props>(this.props, 'classes')}
                />}
        </div>
    }
}

export default withStyles(styles)(IssueList);
