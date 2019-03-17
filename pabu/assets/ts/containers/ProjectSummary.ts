
import { connect } from 'react-redux';
import { Store } from '../types';
import ProjectSummary, {OwnProps, StateProps, UserPaymentStat} from '../components/ProjectSummary';

function mapStateToProps(store: Store, props: OwnProps): StateProps {
    const projectId = props.id;

    const project = store.projects[projectId];
    const payments = Object.values(store.payments).filter(r => r.projectId == projectId);
    const timeEntries = Object.values(store.timeEntries).filter(r => r.projectId == projectId);

    let userPaymentStat: {[n: number]: UserPaymentStat} = {};

    for (let userId of project.users) {
        userPaymentStat[userId] = {spent: 0, paid: 0, user: store.users[userId], ticking: false};
    }

    for (const payment of payments) {
        userPaymentStat[payment.paidUserId].paid += payment.amount;
    }

    for (const entry of timeEntries) {
        if (!(entry.userId in userPaymentStat))
            continue

        const len = (entry.end || (new Date().getTime()/1000)) - entry.start;
        userPaymentStat[entry.userId].spent += len;
        if (entry.end == null)
            userPaymentStat[entry.userId].ticking = true;
    }

    return {
        userStat: Object.values(userPaymentStat),
        project,
    }
}


export default connect(mapStateToProps)(ProjectSummary);
