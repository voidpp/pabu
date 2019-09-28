
import { connect } from 'react-redux';
import { closeAddTimeDialog, closeIssueDialog, closePaymentDialog, closeProject, fetchProjects, openProject, receiveIssues, sendPayment, sendTime, processIssues, fetchAllProjectDataIfNeeded, enqueueNotification, processTags } from '../actions';
import ProjectList, {StateProps, DispatchProps} from '../components/ProjectList';
import { PaymentSubmitData, Project, State, ThunkDispatcher, IssueStatus, Issue, IssueFormData } from '../types';

function mapStateToProps(state: State) {
    const { issueDialogContext, openedProjectId, addTimeDialogContext, paymentDialogProjectId, users, issues, projects, tags } = state;
    let issueData: IssueFormData = {name: '', desc: '', status: IssueStatus.TODO, tags: []};
    if (issueDialogContext && issueDialogContext.id) {
        const serverIssueData = issues[issueDialogContext.id];
        Object.assign(issueData, {
            ...serverIssueData,
            tags: serverIssueData.tags.map(ti => tags[ti].name),
        });
    }

    return {
        issueDialogContext,
        addTimeDialogContext,
        openedProjectId,
        paymentDialogProjectId,
        projects: Object.values(projects).sort((a: Project, b: Project) => b.timeStat.lastEntry - a.timeStat.lastEntry),
        users,
        issueData: issueData,
    }
}

const mapDispatchToProps = (dispatch: ThunkDispatcher) => {
    return {
        onIssueSubmit: (name: string, desc: string, status: IssueStatus, projectId: number, id: number, tags: Array<string>) => {
            // send tags to server
            dispatch(processIssues([{name, desc, status, projectId, id}])).then(issues => {
                dispatch(processTags(Object.values(issues)[0].id, tags)).then(() => { // TODO await?
                    dispatch(closeIssueDialog())
                    dispatch(fetchProjects(projectId))
                    dispatch(receiveIssues(issues))
                    dispatch(enqueueNotification(`Task has been ${id ? 'modified': 'created'}`, {variant: 'success'}));
                })
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
        onHoverTitle: (projectId: number) => {
            dispatch(fetchAllProjectDataIfNeeded(projectId));
        }
    }
}

export default connect<StateProps, DispatchProps>(mapStateToProps, mapDispatchToProps)(ProjectList);
