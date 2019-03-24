
import { Store,  ThunkDispatcher, IssueStatus, Issue, ServerIssueData } from '../types';
import { connect } from 'react-redux';
import { openAddTimeDialog, startTime, stopTime, deleteIssue,  openIssueDialog, receiveIssues, processIssues } from '../actions';
import IssueList, { StateProps, DispatchProps, OwnProps } from '../components/IssueList';

function mapStateToProps(state: Store, props: OwnProps) {
    let {issues, tickingStat} = state;
    return {
        issues: Object.values(issues).filter(i => i.projectId == props.id),
        tickingStat,
    }
}

const mapDispatchToProps = (dispatch: ThunkDispatcher, dd) => {
    return {
        onAddNewTime: (projectId: number, issueId: number) => {
            dispatch(openAddTimeDialog(projectId, issueId));
        },
        startTime: (projectId: number, issueId: number) => {
            dispatch(startTime(projectId, issueId));
        },
        stopTime: (projectId: number) => {
            dispatch(stopTime(projectId));
        },
        onDeleteIssue: (projectId: number, issueId: number) => {
            if(confirm('Do you really want to delete this issue?'))
                dispatch(deleteIssue(issueId, projectId));
        },
        onUpdateIssue: (projectId: number, id: number) => {
            dispatch(openIssueDialog(projectId, id))
        },
        onAddNewIssue: (projectId: number) => {
            dispatch(openIssueDialog(projectId))
        },
        updateIssues: (serverIssues: Array<ServerIssueData>) => {
            dispatch(receiveIssues(serverIssues.reduce((map, i) => (map[i.id] = i, map), {}), true))
            dispatch(processIssues(serverIssues)).then(issues => dispatch(receiveIssues(issues)));

            // dispatch(receiveIssues({[issue.id]: Object.assign({}, issue, {...data})}));
            // dispatch(processIssues({...data, id: issue.id, projectId: issue.projectId})).then(i => dispatch(receiveIssues({[i.id]: i})));
        },
    }
}

export default connect<StateProps, DispatchProps, OwnProps>(mapStateToProps, mapDispatchToProps)(IssueList);
