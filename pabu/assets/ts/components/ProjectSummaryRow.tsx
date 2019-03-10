import * as React from 'react';

import {Project} from '../types';

type Props = {
    project: Project,
}

export default class ProjectSummaryRow extends React.Component<Props> {
    render() {
        return <div>{this.props.project.name}</div>
    }
}
