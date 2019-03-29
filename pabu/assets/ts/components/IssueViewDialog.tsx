import { Button, createStyles, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Grow, IconButton, Theme, Typography, withStyles } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import * as React from 'react';
import { Issue, TickingStat } from '../types';
import { dialogTransition } from './tools';

export type StateProps = {
    issue: Issue,
    show: boolean,  // needed for nice hide effect
    tickingStat: TickingStat,
}

export type DispatchProps = {
    onClose: () => void,
    onAddNewTime: (projectId: number, issueId: number) => void,
    onDeleteIssue: (projectId: number, issueId: number) => void,
    onUpdateIssue: (projectId: number, issueId: number) => void,
    startTime: (projectId: number, issueId: number) => void,
    stopTime: () => void,
}

const styles = ({ palette }: Theme) => createStyles({

});

export default withStyles(styles)(React.memo((props: StateProps & DispatchProps) => {
    const {issue, onClose, show, tickingStat, startTime, stopTime, onDeleteIssue, onAddNewTime, onUpdateIssue} = props;
    if (!issue) return <div></div>;

    function getTickingIcon() {
        if (tickingStat.ticking) {
            if (tickingStat.entry.issueId == issue.id)
                return <Button variant="contained" color="secondary" onClick={stopTime}>Stop time</Button>
            else
                return <Button variant="contained" color="primary" disabled>Start time</Button>
        } else
            return <Button variant="contained" color="primary" onClick={startTime.bind(this, issue.projectId, issue.id)}>Start time</Button>
    }

    return  <Dialog
                TransitionComponent={dialogTransition}
                onClose={onClose}
                open={show}
                className="issue-view-dialog"
                PaperProps={{style: {minWidth: 400}}
            }>
                <DialogTitle className="title" disableTypography>
                    <Typography variant="h6" style={{flexGrow: 1}}>#{issue.id} {issue.name}</Typography>
                    <IconButton aria-label="Close" onClick={onClose}>
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <Divider/>
                <div className="controls">
                    <Button variant="contained" color="primary" onClick={()=>onAddNewTime(issue.projectId, issue.id)}>Add time</Button>
                    {getTickingIcon()}
                    <Button variant="contained" color="primary" onClick={()=>onUpdateIssue(issue.projectId, issue.id)}>Update</Button>
                </div>
                <Divider/>
                <DialogContent className="content">
                    <Typography style={{fontStyle: issue.desc ? 'default' : 'italic'}}>
                        {issue.desc || 'There is no description'}
                    </Typography>
                </DialogContent>
                <Divider/>
                <DialogActions>
                    <Button variant="contained" color="secondary" onClick={()=>onDeleteIssue(issue.projectId, issue.id)}>Delete</Button>
                </DialogActions>
            </Dialog>
}));
