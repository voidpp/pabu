import * as React from 'react';
import { withStyles, Theme, createStyles } from '@material-ui/core';
import { Issue, TickingStat } from '../types';
import ActionIcon from './ActionIcon';
import classNames = require('classnames');

export type OwnProps = {
    tickingStat: TickingStat,
    issue: Issue,
    onAddNewTime: (projectId: number, issueId: number) => void,
    onDeleteIssue: (projectId: number, issueId: number) => void,
    onUpdateIssue: (projectId: number, issueId: number) => void,
    startTime: (projectId: number, issueId: number) => void,
    stopTime: () => void,
}

type MuiProps = {
    classes: any,
}

const styles = ({ palette }: Theme) => createStyles({
    stopIcon: {
        color: palette.secondary.main,
    },
});

export default withStyles(styles)(React.memo((props: OwnProps & MuiProps) => {

    let { issue, onAddNewTime, startTime, stopTime, tickingStat, onDeleteIssue, onUpdateIssue, classes} = props;

    function getTickingIcon(issue: Issue) {
        if (tickingStat.ticking) {
            if (tickingStat.entry.issueId == issue.id)
                return <ActionIcon icon="stopwatch" onClick={stopTime} className={classes.stopIcon} />
            else
                return <ActionIcon icon="stopwatch" disabled/>
        } else
            return <ActionIcon icon="stopwatch" onClick={startTime.bind(this, issue.projectId, issue.id)} />
    }

    const isTicking = tickingStat.ticking && tickingStat.entry.issueId == issue.id;

    return <span className={classNames('issue-action-icons', {ticking: isTicking})}>
        <ActionIcon icon="clock" onClick={onAddNewTime.bind(this, issue.projectId, issue.id)}/>
        {getTickingIcon(issue)}
        <ActionIcon icon="edit" onClick={onUpdateIssue.bind(this, issue.projectId, issue.id)}/>
        <ActionIcon icon="trash" onClick={onDeleteIssue.bind(this, issue.projectId, issue.id)}/>
    </span>
}))
