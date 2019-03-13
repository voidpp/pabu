
import { State, PaymentSubmitData, Project } from '../types';
import { connect } from 'react-redux';
import { sendIssue, openAddIssueDialog, fetchIssues, openProject, openAddTimeDialog, sendTime, closeAddIssueDialog, closeAddTimeDialog,
         closeProject, startTime, stopTime, openPaymentDialog, closePaymentDialog, sendPayment, deleteProject} from '../actions';
import ProjectList from '../components/ProjectList';

function mapStateToProps(state: State) {
    const { projects, addIssueDialogProjectId, openedProjectId, addTimeDialogContext, tickingStat, paymentDialogProjectId, users } = state;
    return {
        addIssueDialogProjectId,
        addTimeDialogContext,
        openedProjectId,
        paymentDialogProjectId,
        projects: Object.values(projects).sort((a: Project, b: Project) => b.timeStat.lastEntry - a.timeStat.lastEntry),
        // projects: Object.values(projects),
        tickingStat,
        users,
    }
}

const mapDispatchToProps = (dispatch: Function) => {
    return {
        onIssueSubmit: (name: string, desc: string, projectId: number) => {
            dispatch(sendIssue(name, desc, projectId))
        },
        onPaymentSubmit: (projectId: number, data: PaymentSubmitData) => {
            dispatch(sendPayment(projectId, data));
        },
        showAddIssueDialog: (projectId: number) => {
            dispatch(openAddIssueDialog(projectId))
        },
        hideAddIssueDialog: () => {
            dispatch(closeAddIssueDialog())
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
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(ProjectList);
