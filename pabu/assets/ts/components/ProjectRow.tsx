import * as React from 'react';

import { Project, TickingStat } from '../types';

import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import Typography from '@material-ui/core/Typography';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import IssueList from '../containers/IssueList';
import TimeStat from './TimeStat';

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
    project: Project,
    expanded: boolean,
    handleChange: (id: number) => void,
    classes: any,
    onAddNewIssue: () => void,
    onAddNewTime: () => void,
    onStartTime: () => void,
    onStopTime: () => void,
    tickingStat: TickingStat,
}

export default withStyles(styles)(React.memo((props: Props) => {
    const { expanded, project, handleChange, classes, onAddNewIssue, onAddNewTime, onStartTime, tickingStat } = props;

    let tickingButton = null;
    if (tickingStat.ticking) {
        if (tickingStat.entry.projectId == project.id)
            tickingButton = <Button color="secondary">Stop time</Button>
    } else
        tickingButton = <Button color="primary" onClick={onStartTime}>Start time</Button>

    return  <ExpansionPanel expanded={expanded} key={project.id} onChange={handleChange.bind(this, project.id)}>
                <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography className={classes.heading}>{project.name}</Typography>
                    <Typography className={classes.secondaryHeading}>
                        <TimeStat stat={project.timeStat} /> in {project.issues.length} issues
                    </Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails style={{display: 'block'}}>
                    <Typography className={classes.secondaryHeading}>{project.desc}</Typography>
                    <div style={{display: 'flex', alignItems: 'center'}}>
                        <Typography style={{flexGrow: 1}}>Issues:</Typography>
                        <div>
                            <Button style={{marginRight: 10}} color="primary" onClick={onAddNewIssue}>Add new issue</Button>
                            <Button color="primary" onClick={onAddNewTime}>Add time</Button>
                            {tickingButton}
                        </div>
                    </div>
                    <IssueList/>
                </ExpansionPanelDetails>
            </ExpansionPanel>
}));