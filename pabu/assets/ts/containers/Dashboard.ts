
import { Store, ThunkDispatcher } from '../types';
import { connect } from 'react-redux';
import { openProjectDialog, stopTime, closeProjectDialog, receiveProjects, sendProject, setDarkTheme } from '../actions';
import Dashboard from '../components/Dashboard';

const mapStateToProps = (state: Store) => {
    const { projectDialogContext, tickingStat, projects, isDarkTheme } = state;
    let projectData = {name: '', desc: ''};
    if (projectDialogContext && projectDialogContext.id) {
        projectData = projects[projectDialogContext.id];
    }
    return {
        projectDialogContext,
        tickingStat,
        projectData,
        isDarkTheme,
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
        onThemeClick: (isDark: boolean) => {
            dispatch(setDarkTheme(isDark))
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard)
