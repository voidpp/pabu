import * as React from 'react';

import { Issue, TickingStat } from '../types';

import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import Typography from '@material-ui/core/Typography';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

const styles = theme => ({
    root: {
        width: '100%',
    },
    heading: {
        fontSize: theme.typography.pxToRem(15),
        flexBasis: '33.33%',
        flexShrink: 0,
    },
    secondaryHeading: {
        fontSize: theme.typography.pxToRem(15),
        color: theme.palette.text.secondary,
    },
});



type Props = {
    issue: Issue,
    expanded: boolean,
    handleChange: (id: number) => void,
    classes: any,
    onAddNewTime: (issueId: number) => void,
    onStartTime: () => void,
    onStopTime: () => void,
    onDeleteIssue: () => void,
    tickingStat: TickingStat,
}

export default withStyles(styles)(React.memo((props: Props) => {
    const { expanded, issue, handleChange, classes, onAddNewTime, onStartTime, onStopTime, tickingStat, onDeleteIssue } = props;

    let tickingButton = <Button disabled>Start time</Button>;
    if (tickingStat.ticking) {
        if (tickingStat.entry.issueId == issue.id)
            tickingButton = <Button color="secondary" variant="contained" onClick={onStopTime}>Stop time</Button>
    } else
        tickingButton = <Button color="primary" onClick={onStartTime}>Start time</Button>

    let spent = (issue.timeStat.spent/3600).toFixed(1);

    return  <ExpansionPanel expanded={expanded} key={issue.id} onChange={handleChange.bind(this, issue.id)}>
                <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography className={classes.heading}>{issue.name}</Typography>
                    <Typography className={classes.secondaryHeading}>{spent} hours</Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails style={{display: 'block'}}>
                    <div>
                        <Button style={{marginRight: 10}} color="primary" onClick={onAddNewTime.bind(this, issue.id)}>
                            Add time
                        </Button>
                        {tickingButton}
                        <Button color="secondary" onClick={onDeleteIssue}>Delete issue</Button>
                    </div>
                </ExpansionPanelDetails>
            </ExpansionPanel>
}));
