import * as React from 'react';

import { Project } from '../types';

import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import Typography from '@material-ui/core/Typography';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import IssueList from '../containers/IssueList';

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
}

export default withStyles(styles)(React.memo((props: Props) => {
    const { expanded, project, handleChange, classes, onAddNewIssue } = props;
    return  <ExpansionPanel expanded={expanded} key={project.id} onChange={handleChange.bind(this, project.id)}>
                <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography className={classes.heading}>{project.name}</Typography>
                    <Typography className={classes.secondaryHeading}>{project.desc} ({project.issues.length})</Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails style={{display: 'block'}}>
                    <div style={{display: 'flex'}}>
                        <Typography style={{flexGrow: 1}}>Issues:</Typography>
                        <div>
                            <Button style={{marginRight: 10}} color="primary" onClick={onAddNewIssue}>
                                Add new issue
                            </Button>
                            <Button color="primary">Add time</Button>
                        </div>
                    </div>
                    <IssueList projectId={project.id}/>
                </ExpansionPanelDetails>
            </ExpansionPanel>
}));
