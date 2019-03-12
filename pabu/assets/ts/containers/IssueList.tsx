
import * as React from 'react';
import { State, ProjectMap, IssueMap } from '../types';
import { connect } from 'react-redux';
import ProjectSummaryRow from '../components/ProjectSummaryRow';
import NameDescFormDialog from '../components/NameDescFormDialog';
import { sendIssue, openAddIssueDialog, openAddTimeDialog } from '../actions';
import IssueRow from '../components/IssueRow';

type Props = {
    issues: IssueMap,
    onAddNewTime: (projectId: number, issueId: number) => void,
}

class IssueList extends React.Component<Props, {openedIssueId: number}> {

    state = {
        openedIssueId: 0,
    };

    render() {
        let {issues, onAddNewTime} = this.props;
        return <div>
                   {
            <div style={{ marginTop: 20 }}>{
                Object.values(issues).map(issue => <IssueRow
                    onAddNewTime={onAddNewTime.bind(this, issue.projectId, issue.id)}
                    key={issue.id}
                    issue={issue}
                    expanded={this.state.openedIssueId === issue.id}
                    handleChange={id => this.setState({openedIssueId: id})}
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
        onAddNewTime: (projectId: number, issueId: number) => {
            dispatch(openAddTimeDialog(projectId, issueId));
        },
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(IssueList);
