
import * as React from 'react';
import Header from '../components/Header';
import { UserInfo, ProjectSubmitCallback, Project, TickingStat, ProjectDialogContext } from '../types';
import { Paper, Grid, Button, Typography } from '@material-ui/core';
import ProjectList from '../containers/ProjectList';
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
    onThemeClick: (isDark: boolean) => void,
    isDarkTheme: boolean,
}

export default React.memo((props: Props) => {

    return <div>
        <NameDescFormDialog
            caption={(props.projectDialogContext && props.projectDialogContext.id) ? "Update project" : "Create project"}
            onSubmit={props.onProjectSubmit.bind(this, props.projectDialogContext ? props.projectDialogContext.id : null)}
            opened={props.projectDialogContext != null}
            initialData={props.projectData}
            onClose={props.hideDialog}
        />
        <Header
            isDarkTheme = {props.isDarkTheme}
            onThemeClick={props.onThemeClick}
            userInfo={props.userInfo}
            tickingStat={props.tickingStat}
            onStopTime={props.stopTime.bind(this, props.tickingStat.ticking ? props.tickingStat.entry.projectId : null)}
        />
        <Grid container justify="center">
            <Paper style={{ minWidth: 1000, marginTop: 20, padding: 20 }}>
                <div style={{display: 'flex'}}>
                    <Typography style={{flexGrow: 1}} variant="h6">Projects:</Typography>
                    <Button color="primary" onClick={props.showDialog}>Create project</Button>
                </div>
                <ProjectList />
            </Paper>
        </Grid>
    </div>
})
