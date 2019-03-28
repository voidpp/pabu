import * as React from 'react';
import { Issue } from '../types';
import { Theme, createStyles, withStyles, Dialog, DialogTitle, Typography, IconButton, DialogContent, DialogActions, Divider, Button } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';


type Props = {
    issue: Issue,
    show: boolean,
    onClose: () => void,
}

const styles = ({ palette }: Theme) => createStyles({

});

export default withStyles(styles)(React.memo((props: Props) => {
    const {issue, show, onClose} = props;
    return  <Dialog disableBackdropClick onClose={onClose} open={show} className="issue-view-dialog" PaperProps={{style: {minWidth: 400}}}>
                <DialogTitle className="title" disableTypography>
                    <Typography variant="h6" style={{flexGrow: 1}}>#{issue.id} {issue.name}</Typography>
                    <IconButton aria-label="Close" onClick={onClose}>
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <Divider/>
                <DialogContent className="content">
                    <Typography style={{fontStyle: issue.desc ? 'default' : 'italic'}}>
                        {issue.desc || 'There is no description'}
                    </Typography>
                </DialogContent>
                <Divider/>
                <DialogActions>
                    <Button>Close</Button>
                </DialogActions>
            </Dialog>
}));
