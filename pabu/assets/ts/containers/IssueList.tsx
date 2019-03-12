
import * as React from 'react';
import { State, IssueMap, TickingStat } from '../types';
import { connect } from 'react-redux';
import { openAddTimeDialog, startTime, stopTime } from '../actions';
import IssueRow from '../components/IssueRow';

type Props = {
    issues: IssueMap,
    onAddNewTime: (projectId: number, issueId: number) => void,
    startTime: (projectId: number, issueId: number) => void,
    stopTime: (projectId: number) => void,
    tickingStat: TickingStat,
}

class IssueList extends React.Component<Props, {openedIssueId: number}> {

    state = {
        openedIssueId: 0,
    };

    render() {
        let {issues, onAddNewTime, startTime, stopTime, tickingStat} = this.props;
        return <div>
                   {
            <div style={{ marginTop: 20 }}>{
                Object.values(issues).map(issue => <IssueRow
                    tickingStat={tickingStat}
                    onStartTime={startTime.bind(this, issue.projectId, issue.id)}
                    onStopTime={stopTime.bind(this, issue.projectId)}
                    onAddNewTime={onAddNewTime.bind(this, issue.projectId, issue.id)}
                    key={issue.id}
                    issue={issue}
                    expanded={this.state.openedIssueId === issue.id}
                    handleChange={id => this.setState({openedIssueId: id == this.state.openedIssueId ? 0 : id})}
                />)
            }</div>}
        </div>
    }

}

function mapStateToProps(state: State) {
    let {issues, openedProjectId, tickingStat} = state;
    let filteredIssues = {};
    for (let issue of Object.values(issues)) {
        if (issue.projectId == openedProjectId)
            filteredIssues[issue.id] = issue;
    }
    return {
        issues: filteredIssues,
        tickingStat,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onAddNewTime: (projectId: number, issueId: number) => {
            dispatch(openAddTimeDialog(projectId, issueId));
        },
        startTime: (projectId: number, issueId: number) => {
            dispatch(startTime(projectId, issueId));
        },
        stopTime: (projectId: number) => {
            dispatch(stopTime(projectId));
        },
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(IssueList);
