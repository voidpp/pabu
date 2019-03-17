
import * as moment from 'moment';
import { connect } from 'react-redux';
import { Store, ThunkDispatcher, TableRowDesriptor, ExpandedPayment } from '../types';
import PabuTable from '../components/PabuTable';
import { formatDuration } from '../tools';
import { deletePayment, fetchAllProjectData, fetchProjects } from '../actions';

function mapStateToProps(state: Store, props: {id: number}) {
    const {payments, users} = state;

    let paymentRows = [];
    for (const payment of Object.values(payments).filter(p => p.projectId == props.id)) {

        let exPayment: ExpandedPayment = {
            ...payment,
            createdUserName: (payment.createdUserId in users) ? users[payment.createdUserId].name : '',
            paidUserName: (payment.paidUserId in users) ? users[payment.paidUserId].name : ''
        }
        paymentRows.push(exPayment)
    }

    const rowDescriptors = [
        new TableRowDesriptor('time', 'Time', v => moment.unix(v).format('YYYY-MM-DD HH:mm')),
        new TableRowDesriptor('amount' , 'Amount', formatDuration),
        new TableRowDesriptor('createdUserName', 'Created'),
        new TableRowDesriptor('paidUserName', 'Paid'),
        new TableRowDesriptor('note', 'Note'),
    ]

    return {
        rows: paymentRows,
        rowDescriptors,
    }
}

const mapDispatchToProps = (dispatch: ThunkDispatcher) => {
    return {
        onDelete: (payment: ExpandedPayment) => {
            const projectId = payment.projectId;
            if (confirm('Do you really want to delete this payment?'))
                dispatch(deletePayment(payment.id)).then(() => {
                    dispatch(fetchProjects(projectId))
                    // dispatch((projectId))
                })
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(PabuTable);
