
import * as React from 'react';
import { State, ProjectMap } from '../types';
import { connect } from 'react-redux';
import ProjectSummaryRow from '../components/ProjectSummaryRow';
import NameDescFormDialog from '../components/NameDescFormDialog';
import { sendIssue, openAddIssueDialog } from '../actions';

type Props = {
    projects: ProjectMap,
    addIssueDialogIsOpen: boolean
    onIssueSubmit: (name: string, desc: string, projectId: number) => void,
    showDialog: () => void,
    hideDialog: () => void,
}

class ProjectList extends React.Component<Props, {expanded: number}> {

    state = {
        expanded: 0,
    };

    render() {
        let {addIssueDialogIsOpen, hideDialog, onIssueSubmit, showDialog} = this.props;
        return <div>
                   <NameDescFormDialog
                        caption="Create issue"
                        text="text"
                        onSubmit={(name, desc) => onIssueSubmit(name, desc, this.state.expanded)}
                        opened={addIssueDialogIsOpen}
                        onClose={hideDialog} />
            <div style={{ marginTop: 20 }}>{
                Object.values(this.props.projects).map(project => <ProjectSummaryRow
                    onAddNewIssue={showDialog}
                    key={project.id}
                    project={project}
                    expanded={this.state.expanded === project.id}
                    handleChange={id => this.setState({expanded: id})}
                />)
            }</div>
        </div>
    }

}

function mapStateToProps(state: State) {
    const { projects, addIssueDialogIsOpen } = state;
    return {
        projects,
        addIssueDialogIsOpen,
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
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(ProjectList);
