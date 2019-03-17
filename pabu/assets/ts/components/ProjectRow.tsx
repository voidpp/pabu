import * as React from 'react';

import { Project, TickingStat, TimeEntry } from '../types';

import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import Typography from '@material-ui/core/Typography';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import { createStyles, Theme, withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import IssueList from '../containers/IssueList';
import TimeEntryList from '../containers/TimeEntryList';

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
    handleChange: (id: number) => void,
    onAddNewIssue: (projectId: number) => void,
    onAddNewTime: (projectId: number) => void,
    onAddPayment: (projectId: number) => void,
    onDeleteProject: (projectId: number) => void,
    onStartTime: (projectId: number) => void,
    onStopTime: (projectId: number) => void,
    onUpdateProject: (projectId: number) => void,
    project: Project,
    tickingStat: TickingStat,
    openedProjectId: number,
}

export default withStyles(styles)(React.memo((props: Props) => {

    const id = props.project.id;

    let tickingButton = <Button size="small" disabled>Start time</Button>;
    if (props.tickingStat.ticking) {
        if (props.tickingStat.entry.projectId == props.project.id)
            tickingButton = <Button size="small" color="secondary" variant="contained" onClick={props.onStopTime.bind(this, id)}>Stop time</Button>
    } else
        tickingButton = <Button size="small" color="primary" onClick={props.onStartTime.bind(this, id)}>Start time</Button>

    let spent = (props.project.timeStat.spent/3600).toFixed(1);
    let paid = Math.ceil(props.project.paid/3600);
    const expanded = props.openedProjectId == id;

    return  <ExpansionPanel
                className={props.classes.root}
                expanded={expanded}
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
                        <Button size="small" color="primary" onClick={props.onAddNewIssue.bind(this, id)}>Create issue</Button>
                        <Button size="small" color="primary" onClick={props.onAddNewTime.bind(this, id)}>Add time</Button>
                        {tickingButton}
                        <Button size="small" color="primary" onClick={props.onAddPayment.bind(this, id)}>Add payment</Button>
                        <Button size="small" color="primary" onClick={props.onUpdateProject.bind(this, id)}>Update project</Button>
                        <Button size="small" color="secondary" onClick={props.onDeleteProject.bind(this, id)}>Delete project</Button>
                    </div>
                    <ExpansionPanel>
                        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                            <Typography className={props.classes.heading}>Time entries</Typography>
                        </ExpansionPanelSummary>
                        <ExpansionPanelDetails >
                            <TimeEntryList />
                        </ExpansionPanelDetails>
                    </ExpansionPanel>
                    <ExpansionPanel>
                        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                            <Typography className={props.classes.heading}>Issues</Typography>
                        </ExpansionPanelSummary>
                        <ExpansionPanelDetails >
                            <IssueList/>
                        </ExpansionPanelDetails>
                    </ExpansionPanel>
                </ExpansionPanelDetails>
            </ExpansionPanel>
}));
