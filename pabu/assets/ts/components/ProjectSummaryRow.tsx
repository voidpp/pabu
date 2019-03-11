import * as React from 'react';

import { Project } from '../types';

import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import Typography from '@material-ui/core/Typography';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import { withStyles } from '@material-ui/core/styles';

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
    handleChange: (name: string) => void,
    classes: any,
}

export default withStyles(styles)(React.memo((props: Props) => {
    const { expanded, project, handleChange, classes } = props;
    return  <ExpansionPanel expanded={expanded} key={project.id} onChange={handleChange.bind(this, project.name)}>
                <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography className={classes.heading}>{project.name}</Typography>
                    <Typography className={classes.secondaryHeading}>{project.desc}</Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>
                    <Typography>
                        Nulla facilisi. Phasellus sollicitudin nulla et quam mattis feugiat. Aliquam eget
                        maximus est, id dignissim quam.
                </Typography>
                </ExpansionPanelDetails>
            </ExpansionPanel>
}));
