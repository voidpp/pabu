import * as React from 'react';

import { Project, TickingStat } from '../types';

import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import Typography from '@material-ui/core/Typography';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import { createStyles, Theme, withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import IssueList from '../containers/IssueList';

const styles = ({ palette, typography }: Theme) => createStyles({
    root: {
        width: '100%',
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
    classes: any,
    expanded: boolean,
    handleChange: (id: number) => void,
    onAddNewIssue: () => void,
    onAddNewTime: () => void,
    onAddPayment: () => void,
    onDeleteProject: () => void,
    onStartTime: () => void,
    onStopTime: () => void,
    onUpdateProject: () => void,
    project: Project,
    tickingStat: TickingStat,
}

export default withStyles(styles)(React.memo((props: Props) => {

    let tickingButton = <Button size="small" disabled>Start time</Button>;
    if (props.tickingStat.ticking) {
        if (props.tickingStat.entry.projectId == props.project.id)
            tickingButton = <Button size="small" color="secondary" variant="contained" onClick={props.onStopTime}>Stop time</Button>
    } else
        tickingButton = <Button size="small" color="primary" onClick={props.onStartTime}>Start time</Button>

    let spent = (props.project.timeStat.spent/3600).toFixed(1);
    let paid = Math.ceil(props.project.paid/3600);

    return  <ExpansionPanel
                className={props.classes.root}
                expanded={props.expanded}
                key={props.project.id}
                onChange={props.handleChange.bind(this, props.project.id)}
            >
                <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography className={props.classes.heading}>{props.project.name}</Typography>
                    <Typography className={props.classes.secondaryHeading}>
                        Spent {spent} hours in {props.project.issues.length} issues ({paid} hours paid)
                    </Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails style={{display: 'block'}}>
                    <div>
                        <Button size="small" color="primary" onClick={props.onAddNewIssue}>Create issue</Button>
                        <Button size="small" color="primary" onClick={props.onAddNewTime}>Add time</Button>
                        {tickingButton}
                        <Button size="small" color="primary" onClick={props.onAddPayment}>Add payment</Button>
                        <Button size="small" color="primary" onClick={props.onUpdateProject}>Update project</Button>
                        <Button size="small" color="secondary" onClick={props.onDeleteProject}>Delete project</Button>
                    </div>
                    <IssueList/>
                </ExpansionPanelDetails>
            </ExpansionPanel>
}));
