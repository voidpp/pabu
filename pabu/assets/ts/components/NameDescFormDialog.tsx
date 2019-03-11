
import * as React from 'react';
import { Button, Dialog, DialogTitle, DialogContent, DialogContentText, TextField, DialogActions } from '@material-ui/core';
import { NameDescSubmitCallback } from '../types';

type Props = {
    opened: boolean,
    onSubmit: NameDescSubmitCallback,
    caption: string,
    text: string,
    onClose: () => void,
}

export default class NameDescFormDialog extends React.Component<Props, {name: string, desc:string}> {

    onSubmit = (ev: React.SyntheticEvent) => {
        ev.preventDefault();
        this.props.onSubmit(this.state.name, this.state.desc);
    }

    render() {
        return <Dialog
            open={this.props.opened}
            onClose={this.props.onClose}
            aria-labelledby="form-dialog-title"
        >
            <DialogTitle id="form-dialog-title">{this.props.caption}</DialogTitle>
            <form onSubmit={this.onSubmit} id="create_project_form">
                <DialogContent>
                    <DialogContentText>{this.props.text}</DialogContentText>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="name"
                            label="Name"
                            type="text"
                            required
                            onChange={ev => {this.setState({name: ev.target.value})}}
                            fullWidth
                        />
                        <TextField
                            margin="dense"
                            id="description"
                            label="Description"
                            type="text"
                            onChange={ev => {this.setState({desc: ev.target.value})}}
                            fullWidth
                        />
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.props.onClose} color="primary">
                        Cancel
                    </Button>
                    <Button type="submit" color="primary">Create</Button>
                </DialogActions>
            </form>
        </Dialog>
    }
}
