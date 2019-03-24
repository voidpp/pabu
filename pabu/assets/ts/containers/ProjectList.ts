
import { connect } from 'react-redux';
import { closeAddTimeDialog, closeIssueDialog, closePaymentDialog, closeProject, fetchProjects, openProject, receiveIssues, sendPayment, sendTime, processIssues } from '../actions';
import ProjectList from '../components/ProjectList';
import { PaymentSubmitData, Project, Store, ThunkDispatcher, IssueStatus } from '../types';

function mapStateToProps(state: Store) {
    const { issueDialogContext, openedProjectId, addTimeDialogContext, paymentDialogProjectId, users, issues } = state;
    let issueData = {name: '', desc: ''};
    if (issueDialogContext && issueDialogContext.id) {
        issueData = issues[issueDialogContext.id];
    }
    return {
        issueDialogContext,
        addTimeDialogContext,
        openedProjectId,
        paymentDialogProjectId,
        projects: Object.values(state.projects).sort((a: Project, b: Project) => b.timeStat.lastEntry - a.timeStat.lastEntry),
        users,
        issueData,
    }
}

const mapDispatchToProps = (dispatch: ThunkDispatcher) => {
    return {
        onIssueSubmit: (name: string, desc: string, status: IssueStatus, projectId: number, id: number) => {
            dispatch(processIssues([{name, desc, status, projectId, id}])).then(issues => {
                dispatch(closeIssueDialog())
                dispatch(fetchProjects(projectId))
                dispatch(receiveIssues(issues))
            })
        },
        onPaymentSubmit: (projectId: number, data: PaymentSubmitData) => {
            dispatch(sendPayment(projectId, data));
        },
        hideAddIssueDialog: () => {
            dispatch(closeIssueDialog())
        },
        hidePaymentDialog: () => {
            dispatch(closePaymentDialog())
        },
        hideAddTimeDialog: () => {
            dispatch(closeAddTimeDialog())
        },
        onTimeSubmit: (amount: string, time: string, projectId: number, issueId: number = null) => {
            dispatch(sendTime(projectId, time, amount, issueId));
        },
        openProject: (projectId: number) => {
            dispatch(openProject(projectId))
        },
        closeProject: () => {
            dispatch(closeProject());
        },
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProjectList);
