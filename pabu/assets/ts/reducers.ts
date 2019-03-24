import { combineReducers } from 'redux';
import { Action } from './actions';
import { Store } from './types';

import * as objectAssignDeep from 'object-assign-deep';


function fetchingProject(state = false, action) {
    if (action.type == Action.REQUEST_PROJECTS)
        return true;
    if (action.type == Action.RECEIVE_PROJECTS)
        return false;
    return state;
}

function projectDialogContext(state = null, action) {
    if (action.type == Action.OPEN_PROJECT_DIALOG)
        return action.context;
    if (action.type == Action.CLOSE_PROJECT_DIALOG)
        return null;
    return state;
}

function issueDialogContext(state = null, action) {
    if (action.type == Action.OPEN_ISSUE_DIALOG)
        return action.context;
    if (action.type == Action.CLOSE_ISSUE_DIALOG)
        return null;
    return state;
}

function openedProjectId(state = 0, action) {
    if (action.type == Action.OPEN_PROJECT)
        return action.id;
    if (action.type == Action.CLOSE_PROJECT)
        return 0;
    return state;
}

function addTimeDialogContext(state = null, action) {
    if (action.type == Action.OPEN_ADD_TIME_DIALOG)
        return action.projectId ? {projectId: action.projectId, issueId: action.issueId} : null;
    if (action.type == Action.CLOSE_ADD_TIME_DIALOG)
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
    if (action.type == Action.CLOSE_PAYMENT_DIALOG)
        return null;
    return state;
}

function isDarkTheme(state = false, action) {
    if (action.type == Action.SET_DARK_THEME)
        return action.isSet;
    return state;
}

function resourceReducerFactory(receiveAction: Action, deleteAction: Action = null) {
    return (state = {}, action) => {
        if (action.type == receiveAction) {
            const updater = action.deepUpdate ? objectAssignDeep : Object.assign;
            return updater({}, state, action.data);
        }
        if (deleteAction && action.type == deleteAction) {
            let newState = Object.assign({}, state);
            delete newState[action.id]
            return newState
        }
        return state;
    }
}

function inviteDialogIsOpen(state = false, action) {
    if (action.type == Action.OPEN_INVITE_DIALOG)
        return true;
    if (action.type == Action.CLOSE_INVITE_DIALOG)
        return false;
    return state;
}

const rootReducer = combineReducers<Store>({
    addTimeDialogContext,
    fetchingProject,
    isDarkTheme,
    issueDialogContext,
    issues: resourceReducerFactory(Action.RECEIVE_ISSUES, Action.DELETE_ISSUE),
    openedProjectId,
    paymentDialogProjectId,
    payments: resourceReducerFactory(Action.RECEIVE_PAYMENTS, Action.DELETE_PAYMENT),
    projectDialogContext,
    projects: resourceReducerFactory(Action.RECEIVE_PROJECTS, Action.DELETE_PROJECT),
    projectInvitationTokens: resourceReducerFactory(Action.RECEIVE_PROJECT_TOKENS, Action.DELETE_PROJECT_TOKEN),
    tickingStat,
    timeEntries: resourceReducerFactory(Action.RECEIVE_TIME_ENTRIES, Action.DELETE_TIME_ENTRY),
    users: resourceReducerFactory(Action.RECEIVE_USERS),
    inviteDialogIsOpen,
});

export default rootReducer
