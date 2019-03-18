import * as React from 'react';

import { Project, TickingStat, TimeEntry, LocalStorageKey } from '../types';

import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import Typography from '@material-ui/core/Typography';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import { createStyles, Theme, withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import IssueList from '../containers/IssueList';
import TimeEntryList from '../containers/TimeEntryList';
import { Tabs, Tab } from '@material-ui/core';
import ProjectSummary from '../containers/ProjectSummary';
import PaymentList from '../containers/PaymentList';
import ProjectInviteTokenList from '../containers/ProjectInviteTokenList';

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
    tabLabel: {
        color: palette.text.primary,
    },
    tabHeader: {
        backgroundColor: palette.background.default,
        marginTop: 10,
    },
});

type Props = {
    classes: any,
    handleChange: (id: number) => void,
    onAddNewIssue: (projectId: number) => void,
    onAddNewTime: (projectId: number) => void,
    onAddPayment: (projectId: number) => void,
    onCreateProjectToken: (projectId: number) => void,
    onDeleteProject: (projectId: number) => void,
    onStartTime: (projectId: number) => void,
    onStopTime: (projectId: number) => void,
    onUpdateProject: (projectId: number) => void,
    project: Project,
    tickingStat: TickingStat,
    openedProjectId: number,
}

type State = {
    currentTab: number,
}

class ProjectRow extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props)
        this.state = {currentTab: parseInt(window.localStorage.getItem(LocalStorageKey.OPENED_PROJECT_TAB)) || 0};
    }

    handleTabChange = (ev, val:number) => {
        this.setState({currentTab: val});
        window.localStorage.setItem(LocalStorageKey.OPENED_PROJECT_TAB, val.toString());
    }

    render() {
        const {classes, handleChange, onAddNewIssue, onAddNewTime, onAddPayment, onDeleteProject, onStartTime, onStopTime, onUpdateProject,
               project, tickingStat, openedProjectId, onCreateProjectToken} = this.props

        const id = project.id;

        let tickingButton = <Button size="small" disabled>Start time</Button>;
        if (tickingStat.ticking) {
            if (tickingStat.entry.projectId == project.id)
                tickingButton = <Button size="small" color="secondary" variant="contained" onClick={onStopTime.bind(this, id)}>Stop time</Button>
        } else
            tickingButton = <Button size="small" color="primary" onClick={onStartTime.bind(this, id)}>Start time</Button>

        let spent = (project.timeStat.spent/3600).toFixed(1);
        let paid = Math.ceil(project.paid/3600);
        const expanded = openedProjectId == id;

        return  <ExpansionPanel
                    className={classes.root}
                    expanded={expanded}
                    key={project.id}
                    onChange={handleChange.bind(this, project.id)}
                >
                    <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography className={classes.heading}>{project.name}</Typography>
                        <Typography className={classes.secondaryHeading}>
                            Spent {spent} hours in {project.issues.length} issues ({paid} hours paid)
                        </Typography>
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails style={{display: 'block'}}>
                        <div>
                            <Button size="small" color="primary" onClick={onAddNewIssue.bind(this, id)}>Create issue</Button>
                            <Button size="small" color="primary" onClick={onAddNewTime.bind(this, id)}>Add time</Button>
                            {tickingButton}
                            <Button size="small" color="primary" onClick={onAddPayment.bind(this, id)}>Add payment</Button>
                            <Button size="small" color="primary" onClick={onCreateProjectToken.bind(this, id)}>Generate invite token</Button>
                            <Button size="small" color="primary" onClick={onUpdateProject.bind(this, id)}>Update project</Button>
                            <Button size="small" color="secondary" onClick={onDeleteProject.bind(this, id)}>Delete project</Button>
                        </div>
                        <Tabs
                            value={this.state.currentTab}
                            onChange={this.handleTabChange}
                            className={classes.tabHeader}
                            indicatorColor="primary"
                        >
                            <Tab label="Summary" className={classes.tabLabel} />
                            <Tab label="Time entries" className={classes.tabLabel} />
                            <Tab label="Issues" className={classes.tabLabel} />
                            <Tab label="Payments" className={classes.tabLabel} />
                            <Tab label="Invite tokens" className={classes.tabLabel} />
                        </Tabs>
                        {this.state.currentTab == 0 && <ProjectSummary id={id} />}
                        {this.state.currentTab == 1 && <TimeEntryList id={id}/>}
                        {this.state.currentTab == 2 && <IssueList/>}
                        {this.state.currentTab == 3 && <PaymentList id={id}/> }
                        {this.state.currentTab == 4 && <ProjectInviteTokenList id={id}/> }
                    </ExpansionPanelDetails>
                </ExpansionPanel>
    }
};

export default withStyles(styles)(ProjectRow);
