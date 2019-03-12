
import * as React from 'react';
import { Button, Dialog, DialogTitle, DialogContent, DialogContentText, TextField, DialogActions } from '@material-ui/core';

type Props = {
    opened: boolean,
    onSubmit: (amount: string) => void,
    onClose: () => void,
}

export default class TimeEntryDialog extends React.Component<Props, {amount: string}> {

    onSubmit = (ev: React.SyntheticEvent) => {
        ev.preventDefault();
        this.props.onSubmit(this.state.amount);
    }

    render() {
        return <Dialog
            open={this.props.opened}
            onClose={this.props.onClose}
            aria-labelledby="form-dialog-title"
        >
            <DialogTitle id="form-dialog-title">Add time entry</DialogTitle>
            <form onSubmit={this.onSubmit} id="create_project_form">
                <DialogContent>
                    <DialogContentText>Add amount of time you spent on this task. Examples: 3h, 3h 30m, 17m. (h: hours, m: minutes)</DialogContentText>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="amount"
                            label="Amount"
                            type="text"
                            required
                            onChange={ev => {this.setState({amount: ev.target.value})}}
                            fullWidth
                        />
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.props.onClose} color="primary">Cancel</Button>
                    <Button type="submit" color="primary">Submit</Button>
                </DialogActions>
            </form>
        </Dialog>
    }
}
