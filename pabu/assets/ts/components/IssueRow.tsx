import * as React from 'react';

import { Project, Issue } from '../types';

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
    // onAddNewIssue: () => void,
}

export default withStyles(styles)(React.memo((props: Props) => {
    const { expanded, issue, handleChange, classes } = props;
    return  <ExpansionPanel expanded={expanded} key={issue.id} onChange={handleChange.bind(this, issue.id)}>
                <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography className={classes.heading}>{issue.name}</Typography>
                    <Typography className={classes.secondaryHeading}>{issue.desc} ({issue.timeEntries.length})</Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>
                    <Typography>
                            issue
                    </Typography>
                </ExpansionPanelDetails>
            </ExpansionPanel>
}));
