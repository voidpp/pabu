
import * as React from 'react';
import Header from '../components/Header';
import { UserInfo, ProjectSubmitCallback, Project, Store, TickingStat, ProjectDialogContext, ThunkDispatcher } from '../types';
import { Paper, Grid, Button, Typography } from '@material-ui/core';
import ProjectList from './ProjectList';
import { connect } from 'react-redux';
import { openProjectDialog, stopTime, closeProjectDialog, receiveProjects, sendProject } from '../actions';
import NameDescFormDialog from '../components/NameDescFormDialog';

type Props = {
    userInfo: UserInfo,
    onProjectSubmit: ProjectSubmitCallback,
    projectDialogContext: ProjectDialogContext,
    showDialog: () => void,
    hideDialog: () => void,
    projectData: Project,
    tickingStat: TickingStat,
    stopTime: (projectId: number) => void,
}

class Dashboard extends React.Component<Props> {

    render() {
        const {
            userInfo,
            onProjectSubmit,
            projectDialogContext,
            showDialog,
            hideDialog,
            tickingStat,
            stopTime,
            projectData,
        } = this.props;
        return <div>
            <NameDescFormDialog
                caption={(projectDialogContext && projectDialogContext.id) ? "Update project" : "Create project"}
                onSubmit={onProjectSubmit.bind(this, projectDialogContext ? projectDialogContext.id : null)}
                opened={projectDialogContext != null}
                initialData={projectData}
                onClose={hideDialog}
            />
            <Header
                userInfo={userInfo}
                tickingStat={tickingStat}
                onStopTime={stopTime.bind(this, tickingStat.ticking ? tickingStat.entry.projectId : null)}
            />
            <Grid container justify="center">
                <Paper style={{ minWidth: 1000, marginTop: 20, padding: 20, backgroundColor: '#f8f8f8' }}>
                    <div style={{display: 'flex'}}>
                        <Typography style={{flexGrow: 1}} variant="h6">Projects:</Typography>
                        <Button color="primary" onClick={showDialog}>Create project</Button>
                    </div>
                    <ProjectList />
                </Paper>
            </Grid>
        </div>
    }
}

const mapStateToProps = (state: Store) => {
    const { projectDialogContext, tickingStat, projects } = state;
    let projectData = {name: '', desc: ''};
    if (projectDialogContext && projectDialogContext.id) {
        projectData = projects[projectDialogContext.id];
    }
    return {
        projectDialogContext,
        tickingStat,
        projectData,
    }
}

const mapDispatchToProps = (dispatch: ThunkDispatcher) => {
    return {
        onProjectSubmit: (id: number, name: string, desc: string) => {
            dispatch(sendProject(name, desc, id)).then(project => {
                dispatch(closeProjectDialog())
                dispatch(receiveProjects({[project.id]: project}))
            })
        },
        showDialog: () => {
            dispatch(openProjectDialog())
        },
        hideDialog: () => {
            dispatch(closeProjectDialog())
        },
        stopTime: (openedProjectId: number) => {
            dispatch(stopTime(openedProjectId))
        },
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard)
