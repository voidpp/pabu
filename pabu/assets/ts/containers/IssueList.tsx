
import * as React from 'react';
import { State, ProjectMap, IssueMap } from '../types';
import { connect } from 'react-redux';
import ProjectSummaryRow from '../components/ProjectSummaryRow';
import NameDescFormDialog from '../components/NameDescFormDialog';
import { sendIssue, openAddIssueDialog } from '../actions';
import IssueRow from '../components/IssueRow';

type Props = {
    issues: IssueMap,
    projectId: number,
    // addTimeDialogOpen: boolean
    // onIssueSubmit: (name: string, desc: string, projectId: number) => void,
    // showDialog: () => void,
    // hideDialog: () => void,
}

class IssueList extends React.Component<Props, {expanded: number}> {

    state = {
        expanded: 0,
    };

    render() {
        // let {addIssueDialogIsOpen, hideDialog, onIssueSubmit, showDialog} = this.props;
        return <div>
                   {
            <div style={{ marginTop: 20 }}>{
                Object.values(this.props.issues).map(issue => <IssueRow
                    key={issue.id}
                    issue={issue}
                    expanded={this.state.expanded === issue.id}
                    handleChange={id => this.setState({expanded: id})}
                />)
            }</div>}
        </div>
    }

}

function mapStateToProps(state: State) {
    let {issues, openedProjectId} = state;
    let filteredIssues = {};
    for (let issue of Object.values(issues)) {
        if (issue.projectId == openedProjectId)
            filteredIssues[issue.id] = issue;
    }
    return {
        issues: filteredIssues,
    }
}

const mapDispatchToProps = dispatch => {
    return {

    }
}


export default connect(mapStateToProps, mapDispatchToProps)(IssueList);
