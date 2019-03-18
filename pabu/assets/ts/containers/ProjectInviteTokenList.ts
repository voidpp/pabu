
import { connect } from 'react-redux';
import { Store, ThunkDispatcher, TableRowDesriptor, ProjectInvitationToken } from '../types';
import PabuTable from '../components/PabuTable';
import { fetchProjects, deleteProjectToken } from '../actions';

function mapStateToProps(state: Store, props: {id: number}) {
    const {projectInvitationTokens} = state;

    const rowDescriptors = [
        new TableRowDesriptor('token' , 'Token'),
    ]

    return {
        rows: Object.values(projectInvitationTokens).filter(t => t.projectId == props.id),
        rowDescriptors,
    }
}

const mapDispatchToProps = (dispatch: ThunkDispatcher) => {
    return {
        onDelete: (prjToken: ProjectInvitationToken) => {
            const projectId = prjToken.projectId;
            if (confirm('Do you really want to delete this token?'))
                dispatch(deleteProjectToken(prjToken.id)).then(() => {
                    dispatch(fetchProjects(projectId))
                })
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(PabuTable);
