
import * as React from 'react';
import { State, ProjectMap, TimeDialogContext, TickingStat, UserMap, PaymentSubmitData } from '../types';
import { connect } from 'react-redux';
import ProjectRow from '../components/ProjectRow';
import NameDescFormDialog from '../components/NameDescFormDialog';
import { sendIssue, openAddIssueDialog, fetchIssues, openProject, openAddTimeDialog, sendTime, closeAddIssueDialog, closeAddTimeDialog,
         closeProject, startTime, stopTime, openPaymentDialog, closePaymentDialog, sendPayment, deleteProject} from '../actions';
import TimeEntryDialog from '../components/TimeEntryDialog';
import PaymentDialog from '../components/PaymentDialog';

type Props = {
    addIssueDialogProjectId: number
    addTimeDialogContext: TimeDialogContext,
    closeProject: Function,
    hideAddIssueDialog: () => void,
    hideAddTimeDialog: () => void,
    hidePaymentDialog: () => void,
    onDeleteProject: (projectId: number) => void,
    onIssueSubmit: (name: string, desc: string, projectId: number) => void,
    onPaymentSubmit: (projectId: number, data: PaymentSubmitData) => void
    onTimeSubmit: (amount: string, projectId: number, issueId: number) => void,
    openedProjectId: number,
    openProject: (id: number) => void,
    paymentDialogProjectId: number,
    projects: ProjectMap,
    showAddIssueDialog: (projectId: number) => void,
    showAddTimeDialog: (projectId: number) => void,
    showPaymentDialog: (projectId: number) => void,
    startTime: (projectId: number) => void,
    stopTime: (projectId: number) => void,
    tickingStat: TickingStat,
    users: UserMap,
}

class ProjectList extends React.Component<Props> {

    render() {
        let {
            addIssueDialogProjectId,
            addTimeDialogContext,
            closeProject,
            hideAddIssueDialog,
            hideAddTimeDialog,
            hidePaymentDialog,
            onDeleteProject,
            onIssueSubmit,
            onPaymentSubmit,
            onTimeSubmit,
            openedProjectId,
            openProject,
            paymentDialogProjectId,
            showAddIssueDialog,
            showAddTimeDialog,
            showPaymentDialog,
            startTime,
            stopTime,
            tickingStat,
            users,
        } = this.props;
        return <div>
                   <NameDescFormDialog
                        caption="Create issue"
                        text="text"
                        onSubmit={(name, desc) => onIssueSubmit(name, desc, openedProjectId)}
                        opened={addIssueDialogProjectId != null}
                        onClose={hideAddIssueDialog} />
                    <TimeEntryDialog
                        opened={addTimeDialogContext != null}
                        onSubmit={amount => onTimeSubmit(amount, addTimeDialogContext.projectId, addTimeDialogContext.issueId)}
                        onClose={hideAddTimeDialog}
                    />
                    <PaymentDialog
                        users={paymentDialogProjectId ? Object.values(users) : []}
                        opened={paymentDialogProjectId != null}
                        onSubmit={onPaymentSubmit.bind(this, paymentDialogProjectId)}
                        onClose={hidePaymentDialog}
                    />
            <div style={{ marginTop: 20 }}>{
                Object.values(this.props.projects).map(project => <ProjectRow
                    onAddPayment={showPaymentDialog.bind(this, project.id)}
                    tickingStat={tickingStat}
                    onStopTime={stopTime.bind(this, project.id)}
                    onStartTime={startTime.bind(this, project.id)}
                    onAddNewIssue={showAddIssueDialog.bind(this, project.id)}
                    onAddNewTime={showAddTimeDialog.bind(this, project.id)}
                    onDeleteProject={onDeleteProject.bind(this, project.id)}
                    key={project.id}
                    project={project}
                    expanded={openedProjectId === project.id}
                    handleChange={id => {
                        if (id == openedProjectId)
                            closeProject();
                        else
                            openProject(id);
                    }}
                />)
            }</div>
        </div>
    }

}

function mapStateToProps(state: State) {
    const { projects, addIssueDialogProjectId, openedProjectId, addTimeDialogContext, tickingStat, paymentDialogProjectId, users } = state;
    return {
        addIssueDialogProjectId,
        addTimeDialogContext,
        openedProjectId,
        paymentDialogProjectId,
        projects,
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
            dispatch(fetchIssues(projectId))
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
