
import { connect } from 'react-redux';
import { processIssues, receiveIssues } from '../actions';
import IssueCardView, { DispatchProps, OwnProps, StateProps } from '../components/IssueCardView';
import { ServerIssueData, Store, ThunkDispatcher, IssueStatus, IssueByStatusMap } from '../types';
import { DropResult } from 'react-beautiful-dnd';

function mapStateToProps(state: Store, props: OwnProps) {
    let {issues} = state;

    let issuesByStatus: IssueByStatusMap = {};
    Object.values(IssueStatus).map(s => {issuesByStatus[s] = []})
    for (const issue of Object.values(issues).filter(i => i.projectId == props.id).sort((a, b) => a.rank - b.rank)) {
        issuesByStatus[issue.status].push(issue);
    }

    return {
        issues: issuesByStatus,
    }
}

const mapDispatchToProps = (dispatch: ThunkDispatcher) => {
    return {
        onDragEnd: (result: DropResult, issues: IssueByStatusMap) => {
            if (result.reason != 'DROP' || !result.destination)
                return;

            const targetStatusIssues = issues[result.destination.droppableId];
            const sourceIssue = issues[result.source.droppableId].filter(i => i.id == parseInt(result.draggableId))[0]
            const shiftToDownIssues = targetStatusIssues.slice(result.destination.index);

            const issuesToProcess: Array<ServerIssueData> = [{
                id: sourceIssue.id,
                projectId: sourceIssue.projectId,
                status: result.source.droppableId == result.destination.droppableId ? sourceIssue.status : result.destination.droppableId as IssueStatus,
                rank: shiftToDownIssues.length ? shiftToDownIssues[0].rank : (targetStatusIssues.length ? targetStatusIssues[targetStatusIssues.length-1].rank+1 : 1),
            }];

            for (const issue of shiftToDownIssues) {
                if (issue.id == sourceIssue.id)
                    continue
                issuesToProcess.push({
                    id: issue.id,
                    projectId: issue.projectId,
                    rank: issuesToProcess[issuesToProcess.length-1].rank + 1,
                })
            }
            dispatch(receiveIssues(issuesToProcess.reduce((map, i) => (map[i.id] = i, map), {}), true))
            dispatch(processIssues(issuesToProcess)).then(issues => dispatch(receiveIssues(issues)));
        }
    }
}

export default connect<StateProps, DispatchProps, OwnProps>(mapStateToProps, mapDispatchToProps)(IssueCardView);
