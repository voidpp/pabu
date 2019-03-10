import { combineReducers } from 'redux';
import { Action } from './actions';

function creatingNewProject(state = false, action) {
    if (action.type == Action.ADD_PROJECT)
        return true;
    else if (action.type == Action.ADD_PROJECT_DONE)
        return false;
    else
        return state;
}

function fetchingProject(state = false, action) {
    if (action.type == Action.REQUEST_PROJECT_LIST)
        return true;
    else if (action.type == Action.RECEIVE_PROJECT_LIST)
        return false;
    else
        return state;
}

function projectList(state = [], action) {
    if (action.type == Action.RECEIVE_PROJECT_LIST) {
        return action.list;
    } else
        return state;
}

function addProjectDialogIsOpen(state = false, action: {type: Action, isOpen: boolean}) {
    if (action.type == Action.OPEN_ADD_PROJECT_DIALOG)
        return action.isOpen;
    else
        return state;
}

const rootReducer = combineReducers({
    creatingNewProject,
    fetchingProject,
    projectList,
    addProjectDialogIsOpen,
});

export default rootReducer
