import { Tab, Tabs } from '@material-ui/core';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import { createStyles, Theme, withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import * as React from 'react';
import IssueList from '../containers/IssueList';
import PaymentList from '../containers/PaymentList';
import ProjectInviteTokenList from '../containers/ProjectInviteTokenList';
import ProjectSummary from '../containers/ProjectSummary';
import TimeEntryList from '../containers/TimeEntryList';
import { LocalStorageKey, Project } from '../types';


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
    project: Project,
    expanded: boolean,
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
        const {classes, handleChange, project, expanded} = this.props

        const id = project.id;

        let spent = (project.timeStat.spent/3600).toFixed(1);
        let paid = Math.ceil(project.paid/3600);

        return  <ExpansionPanel
                    className={classes.root}
                    expanded={expanded}
                    key={id}
                    onChange={handleChange.bind(this, id)}
                >
                    <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography className={classes.heading}>{project.name}</Typography>
                        <Typography className={classes.secondaryHeading}>
                            Spent {spent} hours in {project.issues.length} issues ({paid} hours paid)
                        </Typography>
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails style={{display: 'block'}}>
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
                        {this.state.currentTab == 1 && <TimeEntryList id={id} />}
                        {this.state.currentTab == 2 && <IssueList id={id} />}
                        {this.state.currentTab == 3 && <PaymentList id={id} /> }
                        {this.state.currentTab == 4 && <ProjectInviteTokenList id={id} /> }
                    </ExpansionPanelDetails>
                </ExpansionPanel>
    }
};

export default withStyles(styles)(ProjectRow);
