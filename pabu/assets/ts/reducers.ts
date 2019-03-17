import { combineReducers } from 'redux';
import { Action } from './actions';
import { Store } from './types';


function fetchingProject(state = false, action) {
    if (action.type == Action.REQUEST_PROJECTS)
        return true;
    else if (action.type == Action.RECEIVE_PROJECTS)
        return false;
    return state;
}

function projects(state = {}, action) {
    if (action.type == Action.RECEIVE_PROJECTS)
        return Object.assign({}, state, action.data);
    if (action.type == Action.DELETE_PROJECT) {
        let newState = Object.assign({}, state);
        delete newState[action.id]
        return newState
    }
    return state;
}

function projectDialogContext(state = null, action) {
    if (action.type == Action.OPEN_PROJECT_DIALOG)
        return action.context;
    else if (action.type == Action.CLOSE_PROJECT_DIALOG)
        return null;
    return state;
}

function issueDialogContext(state = null, action) {
    if (action.type == Action.OPEN_ISSUE_DIALOG)
        return action.context;
    else if(action.type == Action.CLOSE_ISSUE_DIALOG)
        return null;
    return state;
}

function issues(state = {}, action) {
    if (action.type == Action.RECEIVE_ISSUES)
        return Object.assign({}, state, action.data);
    else if (action.type == Action.DELETE_ISSUE) {
        let newState = Object.assign({}, state);
        delete newState[action.id]
        return newState
    }
    return state;
}

function openedProjectId(state = 0, action) {
    if (action.type == Action.OPEN_PROJECT)
        return action.id;
    else if(action.type == Action.CLOSE_PROJECT)
        return 0;
    return state;
}

function addTimeDialogContext(state = null, action) {
    if (action.type == Action.OPEN_ADD_TIME_DIALOG)
        return action.projectId ? {projectId: action.projectId, issueId: action.issueId} : null;
    else if(action.type == Action.CLOSE_ADD_TIME_DIALOG)
        return null;
    return state;
}

function tickingStat(state = {ticking: false}, action) {
    if (action.type == Action.RECEIVE_TICKING_STAT)
        return action.data;
    return state;
}

function paymentDialogProjectId(state = null, action) {
    if (action.type == Action.OPEN_PAYMENT_DIALOG)
        return action.projectId;
    else if(action.type == Action.CLOSE_PAYMENT_DIALOG)
        return null;
    return state;
}

function users(state = {}, action) {
    if (action.type == Action.RECEIVE_USERS)
        return Object.assign({}, state, action.data);
    return state;
}

function isDarkTheme(state = false, action) {
    if (action.type == Action.SET_DARK_THEME)
        return action.isSet;
    return state;
}

function timeEntries(state = {}, action) {
    if (action.type == Action.RECEIVE_TIME_ENTRIES)
        return Object.assign({}, state, action.data);
    if (action.type == Action.DELETE_TIME_ENTRY) {
        let newState = Object.assign({}, state);
        delete newState[action.id]
        return newState
    }
    return state;
}

const rootReducer = combineReducers<Store>({
    fetchingProject,
    projects,
    issues,
    users,
    projectDialogContext,
    addTimeDialogContext,
    issueDialogContext,
    openedProjectId,
    tickingStat,
    paymentDialogProjectId,
    isDarkTheme,
    timeEntries,
});

export default rootReducer
