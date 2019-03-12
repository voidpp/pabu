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
    if (action.type == Action.REQUEST_PROJECTS)
        return true;
    else if (action.type == Action.RECEIVE_PROJECTS)
        return false;
    else
        return state;
}

function projects(state = {}, action) {
    if (action.type == Action.RECEIVE_PROJECTS) {
        return Object.assign({}, state, action.data);
    } else
        return state;
}


function addProjectDialogIsOpen(state = false, action: {type: Action, isOpen: boolean}) {
    if (action.type == Action.OPEN_ADD_PROJECT_DIALOG)
        return action.isOpen;
    else
        return state;
}

function addIssueDialogIsOpen(state = false, action) {
    if (action.type == Action.OPEN_ADD_ISSUE_DIALOG)
        return action.isOpen;
    else
        return state;
}

function issues(state = {}, action) {
    if (action.type == Action.RECEIVE_ISSUES)
        return Object.assign({}, state, action.data);
    else
        return state;
}

function openedProjectId(state = 0, action) {
    if (action.type == Action.OPEN_PROJECT)
        return action.id;
    else
        return state;
}

const rootReducer = combineReducers({
    creatingNewProject,
    fetchingProject,
    projects,
    issues,
    addProjectDialogIsOpen,
    addIssueDialogIsOpen,
    openedProjectId,
});

export default rootReducer
