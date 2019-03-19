
import { connect } from 'react-redux';
import { Store, TableRowDesriptor, ThunkDispatcher, User } from '../types';
import PabuTable from '../components/PabuTable';
import { kickUserFromProject, fetchProjects } from '../actions';

type Props = {
    id: number,
}

function mapStateToProps(state: Store, props: Props) {
    const {users, projects} = state;

    const project = projects[props.id];

    const rowDescriptors = [
        new TableRowDesriptor('name', 'Name'),
    ]

    return {
        rows: Object.values(users).filter(u => project.users.indexOf(u.id) != -1),
        rowDescriptors,
        context: project.id,
    }
}

const mapDispatchToProps = (dispatch: ThunkDispatcher) => {
    return {
        onDelete: (user: User, context: any) => {
            if (confirm('Do you really want to kick this user from this project?')) {
                dispatch(kickUserFromProject(context, user.id));
                dispatch(fetchProjects(context))
            }
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(PabuTable);
