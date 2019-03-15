
import * as React from 'react';
import { Store, IssueMap, TickingStat, ThunkDispatcher } from '../types';
import { connect } from 'react-redux';
import { openAddTimeDialog, startTime, stopTime, deleteIssue, sendIssue, openIssueDialog } from '../actions';
import IssueList from '../components/IssueList';

type Props = {
    issues: IssueMap,
    onAddNewTime: (projectId: number, issueId: number) => void,
    onDeleteIssue: (projectId: number, issueId: number) => void,
    onUpdateIssue: (projectId: number, issueId: number) => void,
    startTime: (projectId: number, issueId: number) => void,
    stopTime: (projectId: number) => void,
    tickingStat: TickingStat,
}

function mapStateToProps(state: Store) {
    let {issues, openedProjectId, tickingStat} = state;
    let filteredIssues = [];
    for (let issue of Object.values(issues)) {
        if (issue.projectId == openedProjectId)
            filteredIssues.push(issue);
    }
    return {
        issues: filteredIssues,
        tickingStat,
    }
}

const mapDispatchToProps = (dispatch: ThunkDispatcher) => {
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
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(IssueList);
