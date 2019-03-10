
import * as React from 'react';
import { Project } from '../types';
import { connect } from 'react-redux';
import ProjectSummaryRow from '../components/ProjectSummaryRow';
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

class ProjectList extends React.Component<{ projectList: Array<Project>, classes: any }, {expanded: string}> {

    state = {
        expanded: null,
    };

    handleChange = panel => (_event, expanded) => {
        this.setState({
            expanded: expanded ? panel : false,
        });
    };

    private renderProject(project: Project) {
        const { expanded } = this.state;
        const { classes } = this.props;

        return <ExpansionPanel expanded={expanded === project.name} key={project.id} onChange={this.handleChange(project.name)}>
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                <Typography className={classes.heading}>{project.name}</Typography>
                <Typography className={classes.secondaryHeading}>I am an expansion panel</Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
                <Typography>
                    Nulla facilisi. Phasellus sollicitudin nulla et quam mattis feugiat. Aliquam eget
                    maximus est, id dignissim quam.
            </Typography>
            </ExpansionPanelDetails>
        </ExpansionPanel>
    }

    render() {
        return <div style={{ marginTop: 20 }}>{
            this.props.projectList.map(project => this.renderProject(project))
        }</div>
    }

}

function mapStateToProps(state) {
    const { projectList } = state;
    return {
        projectList
    }
}

export default withStyles(styles)(connect(mapStateToProps)(ProjectList));



