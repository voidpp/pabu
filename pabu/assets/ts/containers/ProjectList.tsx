
import * as React from 'react';
import { State, ProjectMap } from '../types';
import { connect } from 'react-redux';
import ProjectSummaryRow from '../components/ProjectSummaryRow';
import NameDescFormDialog from '../components/NameDescFormDialog';
import { sendIssue, openAddIssueDialog, fetchIssues, openProject } from '../actions';

type Props = {
    projects: ProjectMap,
    addIssueDialogIsOpen: boolean
    onIssueSubmit: (name: string, desc: string, projectId: number) => void,
    showDialog: () => void,
    hideDialog: () => void,
    onShowProject: (id: number) => void,
    openedProjectId: number,
}

class ProjectList extends React.Component<Props> {

    render() {
        let {addIssueDialogIsOpen, hideDialog, onIssueSubmit, showDialog} = this.props;
        return <div>
                   <NameDescFormDialog
                        caption="Create issue"
                        text="text"
                        onSubmit={(name, desc) => onIssueSubmit(name, desc, this.props.openedProjectId)}
                        opened={addIssueDialogIsOpen}
                        onClose={hideDialog} />
            <div style={{ marginTop: 20 }}>{
                Object.values(this.props.projects).map(project => <ProjectSummaryRow
                    onAddNewIssue={showDialog}
                    key={project.id}
                    project={project}
                    expanded={this.props.openedProjectId === project.id}
                    handleChange={id => {
                        this.props.onShowProject(id);
                    }}
                />)
            }</div>
        </div>
    }

}

function mapStateToProps(state: State) {
    const { projects, addIssueDialogIsOpen, openedProjectId } = state;
    return {
        projects,
        addIssueDialogIsOpen,
        openedProjectId,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onIssueSubmit: (name: string, desc: string, projectId: number) => {
            dispatch(sendIssue(name, desc, projectId))
        },
        showDialog: () => {
            dispatch(openAddIssueDialog())
        },
        hideDialog: () => {
            dispatch(openAddIssueDialog(false))
        },
        onShowProject: (projectId: number) => {
            dispatch(fetchIssues(projectId))
            dispatch(openProject(projectId))
        },
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(ProjectList);
