
import * as React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withSnackbar, WithSnackbarProps } from 'notistack';
import { removeNotification } from '../actions';
import { Notification } from '../types';

export type OwnProps = {
    notifications: Array<Notification>,
    removeSnackbar: (key: any) => void,
}

class Notifier extends React.Component<OwnProps & WithSnackbarProps> {
    displayed = [];

    storeDisplayed = (id) => {
        this.displayed = [...this.displayed, id];
    };

    shouldComponentUpdate({ notifications: newSnacks = [] }) {
        const { notifications: currentSnacks } = this.props;
        let notExists = false;
        for (let i = 0; i < newSnacks.length; i += 1) {
            if (notExists) continue;
            notExists = notExists || !currentSnacks.filter(({ key }) => newSnacks[i].key === key).length;
        }
        return notExists;
    }

    componentDidUpdate() {
        const { notifications = [] } = this.props;

        notifications.forEach((notification) => {
            // Do nothing if snackbar is already displayed
            if (this.displayed.includes(notification.key)) return;
            // Display snackbar using notistack
            this.props.enqueueSnackbar(notification.message, Object.assign({anchorOrigin: {vertical: 'top', horizontal: 'right'}}, notification.options));
            // Keep track of snackbars that we've displayed
            this.storeDisplayed(notification.key);
            // Dispatch action to remove snackbar from redux store
            this.props.removeSnackbar(notification.key);
        });
    }

    render() {
        return null;
    }
}

const mapStateToProps = store => ({
    notifications: store.notifications,
});

const mapDispatchToProps = dispatch => bindActionCreators({ removeSnackbar: removeNotification }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(withSnackbar(Notifier));
