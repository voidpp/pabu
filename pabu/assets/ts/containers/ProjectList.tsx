
import * as React from 'react';
import { State, ProjectMap, TimeDialogContext } from '../types';
import { connect } from 'react-redux';
import ProjectSummaryRow from '../components/ProjectSummaryRow';
import NameDescFormDialog from '../components/NameDescFormDialog';
import { sendIssue, openAddIssueDialog, fetchIssues, openProject, openAddTimeDialog, sendTime, closeAddIssueDialog, closeAddTimeDialog,
         closeProject } from '../actions';
import TimeEntryDialog from '../components/TimeEntryDialog';

type Props = {
    projects: ProjectMap,
    addIssueDialogProjectId: number
    onIssueSubmit: (name: string, desc: string, projectId: number) => void,
    onTimeSubmit: (amount: string, projectId: number, issueId: number) => void,
    showAddIssueDialog: (projectId: number) => void,
    hideAddIssueDialog: () => void,
    openProject: (id: number) => void,
    openedProjectId: number,
    addTimeDialogContext: TimeDialogContext,
    showAddTimeDialog: (projectId: number) => void,
    hideAddTimeDialog: () => void,
    closeProject: Function,
}

class ProjectList extends React.Component<Props> {

    render() {
        let {
            addIssueDialogProjectId,
            hideAddIssueDialog,
            onIssueSubmit,
            showAddIssueDialog,
            addTimeDialogContext,
            showAddTimeDialog,
            hideAddTimeDialog,
            onTimeSubmit,
            openedProjectId,
            openProject,
            closeProject,
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
            <div style={{ marginTop: 20 }}>{
                Object.values(this.props.projects).map(project => <ProjectSummaryRow
                    onAddNewIssue={showAddIssueDialog.bind(this, project.id)}
                    onAddNewTime={showAddTimeDialog.bind(this, project.id)}
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
    const { projects, addIssueDialogProjectId, openedProjectId, addTimeDialogContext } = state;
    return {
        projects,
        addIssueDialogProjectId,
        openedProjectId,
        addTimeDialogContext,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onIssueSubmit: (name: string, desc: string, projectId: number) => {
            dispatch(sendIssue(name, desc, projectId))
        },
        showAddIssueDialog: (projectId: number) => {
            dispatch(openAddIssueDialog(projectId))
        },
        hideAddIssueDialog: () => {
            dispatch(closeAddIssueDialog())
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
        openProject: (projectId: number) => {
            dispatch(fetchIssues(projectId))
            dispatch(openProject(projectId))
        },
        closeProject: () => {
            dispatch(closeProject());
        }
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(ProjectList);
