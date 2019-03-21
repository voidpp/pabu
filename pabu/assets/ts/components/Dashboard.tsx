
import * as React from 'react';
import Header from '../containers/Header';
import { UserInfo, ProjectSubmitCallback, Project, ProjectDialogContext } from '../types';
import { Paper, Grid, Button, Typography, Theme, createStyles, withStyles } from '@material-ui/core';
import ProjectList from '../containers/ProjectList';
import NameDescFormDialog from '../components/NameDescFormDialog';
import InviteDialog from './InviteDialog';

type Props = {
    userInfo: UserInfo,
    onProjectSubmit: ProjectSubmitCallback,
    projectDialogContext: ProjectDialogContext,
    onInviteSubmit: (token: string) => void,
    showInviteDialog: () => void,
    hideInviteDialog: () => void,
    showDialog: () => void,
    hideDialog: () => void,
    projectData: Project,
    classes: any,
    inviteDialogIsOpen: boolean,
    version: string,
}

const styles = ({ palette }: Theme) => createStyles({
    body: {
        backgroundColor: palette.background.default,
        minWidth: 1000,
        marginTop: 20,
        padding: 20,
    }
});


export default withStyles(styles)(React.memo((props: Props) => {

    return <div>
        <NameDescFormDialog
            caption={(props.projectDialogContext && props.projectDialogContext.id) ? "Update project" : "Create project"}
            onSubmit={props.onProjectSubmit.bind(this, props.projectDialogContext ? props.projectDialogContext.id : null)}
            opened={props.projectDialogContext != null}
            initialData={props.projectData}
            onClose={props.hideDialog}
        />
        <InviteDialog
            opened={props.inviteDialogIsOpen}
            onSubmit={props.onInviteSubmit}
            onClose={props.hideInviteDialog}
        />
        <Header userInfo={props.userInfo} version={props.version} />
        <Grid container justify="center">
            <Paper className={props.classes.body}>
                <div style={{display: 'flex'}}>
                    <Typography style={{flexGrow: 1}} variant="h6">Projects</Typography>
                    <Button color="primary" onClick={props.showInviteDialog}>Join to project</Button>
                    <Button color="primary" onClick={props.showDialog}>Create project</Button>
                </div>
                <ProjectList />
            </Paper>
        </Grid>
    </div>
}))
