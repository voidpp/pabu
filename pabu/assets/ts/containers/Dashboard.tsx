
import * as React from 'react';
import Header from '../components/Header';
import { UserInfo, ProjectSubmitCallback, Project, State, TickingStat } from '../types';
import { Paper, Grid, Button, Typography } from '@material-ui/core';
import ProjectList from './ProjectList';
import { connect } from 'react-redux';
import { sendProject, openAddProjectDialog, stopTime } from '../actions';
import NameDescFormDialog from '../components/NameDescFormDialog';

type Props = {
    userInfo: UserInfo,
    onProjectSubmit: ProjectSubmitCallback,
    addProjectDialogIsOpen: boolean,
    showDialog: () => void,
    hideDialog: () => void,
    tickingStat: TickingStat,
    stopTime: (projectId: number) => void,
}

class Dashboard extends React.Component<Props> {

    render() {
        const {
            userInfo,
            onProjectSubmit,
            addProjectDialogIsOpen,
            showDialog,
            hideDialog,
            tickingStat,
            stopTime,
        } = this.props;
        return <div>
            <NameDescFormDialog
                caption="Create project"
                onSubmit={onProjectSubmit}
                opened={addProjectDialogIsOpen}
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

const mapStateToProps = (state: State) => {
    const { addProjectDialogIsOpen, tickingStat } = state;
    return {
        addProjectDialogIsOpen,
        tickingStat,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onProjectSubmit: (name: string, desc: string) => {
            dispatch(sendProject(name, desc))
        },
        showDialog: () => {
            dispatch(openAddProjectDialog())
        },
        hideDialog: () => {
            dispatch(openAddProjectDialog(false))
        },
        stopTime: (openedProjectId: number) => {
            dispatch(stopTime(openedProjectId))
        },
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard)
