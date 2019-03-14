import * as React from 'react';

import { Issue, TickingStat } from '../types';

import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import Typography from '@material-ui/core/Typography';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import { withStyles, createStyles, Theme } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';


const styles = ({ palette, typography }: Theme) => createStyles({
    root: {
        width: '100%',
        backgroundColor: '#f8f8f8',
    },
    heading: {
        fontSize: typography.pxToRem(15),
        flexBasis: '33.33%',
        flexShrink: 0,
    },
    secondaryHeading: {
        fontSize: typography.pxToRem(15),
        color: palette.text.secondary,
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
    onUpdateIssue: () => void,
    tickingStat: TickingStat,
}

export default withStyles(styles)(React.memo((props: Props) => {

    let tickingButton = <Button disabled>Start time</Button>;
    if (props.tickingStat.ticking) {
        if (props.tickingStat.entry.issueId == props.issue.id)
            tickingButton = <Button color="secondary" variant="contained" onClick={props.onStopTime}>Stop time</Button>
    } else
        tickingButton = <Button color="primary" onClick={props.onStartTime}>Start time</Button>

    let spent = (props.issue.timeStat.spent / 3600).toFixed(1);

    return <ExpansionPanel
                className={props.classes.root}
                expanded={props.expanded}
                key={props.issue.id}
                onChange={props.handleChange.bind(this, props.issue.id)}
            >
                <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography className={props.classes.heading}>{props.issue.name}</Typography>
                    <Typography className={props.classes.secondaryHeading}>{spent} hours</Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails style={{ display: 'block' }}>
                    <div>
                        <Button color="primary" onClick={props.onAddNewTime.bind(this, props.issue.id)}>Add time</Button>
                        {tickingButton}
                        <Button color="primary" onClick={props.onUpdateIssue}>Update issue</Button>
                        <Button color="secondary" onClick={props.onDeleteIssue}>Delete issue</Button>
                    </div>
                </ExpansionPanelDetails>
            </ExpansionPanel>
}));
