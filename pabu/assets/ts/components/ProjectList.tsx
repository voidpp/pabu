
import * as React from 'react';
import { TimeDialogContext, UserMap, PaymentSubmitData, Project, IssueDialogContext, Issue } from '../types';
import ProjectRow from '../components/ProjectRow';
import NameDescFormDialog from '../components/NameDescFormDialog';
import TimeEntryDialog from '../components/TimeEntryDialog';
import PaymentDialog from '../components/PaymentDialog';

type Props = {
    issueDialogContext: IssueDialogContext
    addTimeDialogContext: TimeDialogContext,
    closeProject: Function,
    hideAddIssueDialog: () => void,
    hideAddTimeDialog: () => void,
    hidePaymentDialog: () => void,
    onIssueSubmit: (name: string, desc: string, projectId: number, id: number) => void,
    onPaymentSubmit: (projectId: number, data: PaymentSubmitData) => void
    onTimeSubmit: (amount: string, projectId: number, issueId: number) => void,
    openedProjectId: number,
    openProject: (id: number) => void,
    paymentDialogProjectId: number,
    projects: Array<Project>,
    users: UserMap,
    issueData: Issue,
}

export default React.memo((props: Props) => {

    return <div>
                <NameDescFormDialog
                    caption="Create issue"
                    onSubmit={(name, desc) => props.onIssueSubmit(name, desc, props.issueDialogContext.projectId, props.issueDialogContext.id)}
                    opened={props.issueDialogContext != null}
                    initialData={props.issueData}
                    onClose={props.hideAddIssueDialog} />
                <TimeEntryDialog
                    opened={props.addTimeDialogContext != null}
                    onSubmit={amount => props.onTimeSubmit(amount, props.addTimeDialogContext.projectId, props.addTimeDialogContext.issueId)}
                    onClose={props.hideAddTimeDialog}
                />
                <PaymentDialog
                    users={props.paymentDialogProjectId ? Object.values(props.users) : []}
                    opened={props.paymentDialogProjectId != null}
                    onSubmit={props.onPaymentSubmit.bind(this, props.paymentDialogProjectId)}
                    onClose={props.hidePaymentDialog}
                />
        <div style={{ marginTop: 20 }}>{
            props.projects.map(project => <ProjectRow
                key={project.id}
                project={project}
                expanded={project.id == props.openedProjectId}
                handleChange={id => {
                    if (id == props.openedProjectId)
                        props.closeProject();
                    else
                        props.openProject(id);
                }}
            />)
        }</div>
    </div>
});
