
import { connect } from 'react-redux';
import { deleteProject, openAddTimeDialog, openIssueDialog, openPaymentDialog, openProjectDialog, startTime, stopTime } from '../actions';
import { Store, ThunkDispatcher } from '../types';
import ProjectRow from '../components/ProjectRow';

function mapStateToProps(state: Store) {
    const {tickingStat, openedProjectId} = state;
    return {
        tickingStat,
        openedProjectId,
    }
}

const mapDispatchToProps = (dispatch: ThunkDispatcher) => {
    return {
        onAddNewIssue: (projectId: number) => {
            dispatch(openIssueDialog(projectId))
        },
        onAddPayment: (projectId: number) => {
            dispatch(openPaymentDialog(projectId))
        },
        onAddNewTime: (projectId) => {
            dispatch(openAddTimeDialog(projectId))
        },
        onStartTime: (projectId: number) => {
            dispatch(startTime(projectId))
        },
        onStopTime: (openedProjectId: number) => {
            dispatch(stopTime(openedProjectId))
        },
        onDeleteProject: (projectId: number) => {
            if(confirm('Do you really want to delete this project?'))
                dispatch(deleteProject(projectId));
        },
        onUpdateProject: (projectId: number) => {
            dispatch(openProjectDialog(projectId))
        },
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProjectRow);
