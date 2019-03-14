
import * as React from 'react';
import { TimeDialogContext, TickingStat, UserMap, PaymentSubmitData, Project } from '../types';
import ProjectRow from '../components/ProjectRow';
import NameDescFormDialog from '../components/NameDescFormDialog';
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
    projects: Array<Project>,
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
            projects,
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
                projects.map(project => <ProjectRow
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

export default ProjectList;
