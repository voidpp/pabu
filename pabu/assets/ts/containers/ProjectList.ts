
import { Store, PaymentSubmitData, Project, ThunkDispatcher } from '../types';
import { connect } from 'react-redux';
import { sendIssue, openIssueDialog, openProject, openAddTimeDialog, sendTime, closeIssueDialog, closeAddTimeDialog,
         closeProject, startTime, stopTime, openPaymentDialog, closePaymentDialog, sendPayment, deleteProject, openProjectDialog, fetchProjects, fetchIssues, receiveIssues} from '../actions';
import ProjectList from '../components/ProjectList';

function mapStateToProps(state: Store) {
    const { issueDialogContext, openedProjectId, addTimeDialogContext, tickingStat, paymentDialogProjectId, users, issues } = state;
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
        tickingStat,
        users,
        issueData,
    }
}

const mapDispatchToProps = (dispatch: ThunkDispatcher) => {
    return {
        onIssueSubmit: (name: string, desc: string, projectId: number, id: number) => {
            dispatch(sendIssue(name, desc, projectId, id)).then(issue => {
                dispatch(closeIssueDialog())
                dispatch(fetchProjects(projectId))
                dispatch(receiveIssues({[issue.id]: issue}))
            })
        },
        onPaymentSubmit: (projectId: number, data: PaymentSubmitData) => {
            dispatch(sendPayment(projectId, data));
        },
        showAddIssueDialog: (projectId: number) => {
            dispatch(openIssueDialog(projectId))
        },
        hideAddIssueDialog: () => {
            dispatch(closeIssueDialog())
        },
        showPaymentDialog: (projectId: number) => {
            dispatch(openPaymentDialog(projectId))
        },
        hidePaymentDialog: () => {
            dispatch(closePaymentDialog())
        },
        showAddTimeDialog: (projectId) => {
            dispatch(openAddTimeDialog(projectId))
        },
        hideAddTimeDialog: () => {
            dispatch(closeAddTimeDialog())
        },
        onTimeSubmit: (amount: string, projectId: number, issueId: number = null) => {
            dispatch(sendTime(projectId, amount, issueId));
        },
        startTime: (projectId: number) => {
            dispatch(startTime(projectId))
        },
        stopTime: (openedProjectId: number) => {
            dispatch(stopTime(openedProjectId))
        },
        openProject: (projectId: number) => {
            dispatch(openProject(projectId))
        },
        closeProject: () => {
            dispatch(closeProject());
        },
        onDeleteProject: (projectId: number) => {
            if(confirm('Do you really want to delete this project?'))
                dispatch(deleteProject(projectId));
        },
        onUpdateProject: (projectId: number) => {
            dispatch(openProjectDialog(projectId))
        },
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(ProjectList);
