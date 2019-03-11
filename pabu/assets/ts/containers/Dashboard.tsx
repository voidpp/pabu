
import * as React from 'react';
import Header from '../components/Header';
import { UserInfo, ProjectSubmitCallback, Project, State } from '../types';
import { Paper, Grid, Button } from '@material-ui/core';
import ProjectList from './ProjectList';
import { connect } from 'react-redux';
import { sendProject, openAddProjectDialog } from '../actions';
import NameDescFormDialog from '../components/NameDescFormDialog';

type Props = {
    userInfo: UserInfo,
    onProjectSubmit: ProjectSubmitCallback,
    addProjectDialogIsOpen: boolean,
    showDialog: () => void,
    hideDialog: () => void,
}

class Dashboard extends React.Component<Props> {

    render() {

        const { userInfo, onProjectSubmit, addProjectDialogIsOpen, showDialog, hideDialog } = this.props;
        return <div>
            <NameDescFormDialog
                caption="Create project"
                text="some desc"
                onSubmit={onProjectSubmit}
                opened={addProjectDialogIsOpen}
                onClose={hideDialog}
            />
            <Header userInfo={userInfo} />
            <Grid container justify="center">
                <Paper style={{ minWidth: 1000, marginTop: 20, padding: 20 }}>
                    <Button
                        color="primary"
                        variant="contained"
                        onClick={showDialog}
                    >Create project</Button>
                    <ProjectList />
                </Paper>
            </Grid>
        </div>
    }
}

const mapStateToProps = (state: State) => {
    const { addProjectDialogIsOpen } = state;
    return {
        addProjectDialogIsOpen,
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
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard)
