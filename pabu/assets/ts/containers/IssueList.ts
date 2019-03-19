
import { Store,  ThunkDispatcher } from '../types';
import { connect } from 'react-redux';
import { openAddTimeDialog, startTime, stopTime, deleteIssue,  openIssueDialog } from '../actions';
import IssueList from '../components/IssueList';

function mapStateToProps(state: Store, props: {id: number}) {
    let {issues, tickingStat} = state;
    return {
        issues: Object.values(issues).filter(i => i.projectId == props.id),
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
