
import { Button, createStyles, Grid, Theme, Typography, withStyles } from '@material-ui/core';
import * as React from 'react';
import NameDescFormDialog from '../components/NameDescFormDialog';
import Header from '../containers/Header';
import ProjectList from '../containers/ProjectList';
import { Project, ProjectDialogContext, ProjectSubmitCallback, UserInfo } from '../types';
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

const styles = ({ palette, shape }: Theme) => createStyles({
    body: {
        backgroundColor: palette.background.default,
        minWidth: 1000,
        marginTop: 20,
        padding: 20,
        borderRadius: shape.borderRadius,
    },
    root: {
        backgroundColor: palette.background.paper,
    }
});


export default withStyles(styles)(React.memo((props: Props) => {

    return <div className={props.classes.root}>
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
            <div className={props.classes.body}>
                <div style={{display: 'flex'}}>
                    <Typography style={{flexGrow: 1}} variant="h6">Projects</Typography>
                    <Button color="primary" onClick={props.showInviteDialog}>Join to project</Button>
                    <Button color="primary" onClick={props.showDialog}>Create project</Button>
                </div>
                <ProjectList />
            </div>
        </Grid>
    </div>
}))
