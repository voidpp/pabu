
import * as React from 'react';
import { Project } from '../types';
import { connect } from 'react-redux';
import ProjectSummaryRow from '../components/ProjectSummaryRow';

class ProjectList extends React.Component<{ projectList: Array<Project> }, {expanded: string}> {

    state = {
        expanded: null,
    };

    render() {
        return <div style={{ marginTop: 20 }}>{
            this.props.projectList.map(project => <ProjectSummaryRow
                    key={project.id}
                    project={project}
                    expanded={this.state.expanded === project.name}
                    handleChange={name => this.setState({expanded: name})}
                />)
        }</div>
    }

}

function mapStateToProps(state) {
    const { projectList } = state;
    return {
        projectList
    }
}

export default connect(mapStateToProps)(ProjectList);
