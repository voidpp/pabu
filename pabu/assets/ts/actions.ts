import client from "./client";

import {Action as RAction, ActionCreator, Dispatch} from 'redux';
import {ThunkAction} from 'redux-thunk';

export enum Action {
    ADD_PROJECT = 'ADD_PROJECT',
    ADD_PROJECT_DONE = 'ADD_PROJECT_DONE',
    REQUEST_PROJECT_LIST = 'REQUEST_PROJECT_LIST',
    RECEIVE_PROJECT_LIST = 'RECEIVE_PROJECT_LIST',
    OPEN_ADD_PROJECT_DIALOG = 'OPEN_ADD_PROJECT_DIALOG',
}

export function openAddProjectDialog(isOpen = true){
    return {
        type: Action.OPEN_ADD_PROJECT_DIALOG,
        isOpen,
    }
}

export function addProject(name: string, description: string) {
    return {
        type: Action.ADD_PROJECT,
        name,
        description,
    }
}

export function addProjectDone() {
    return {
        type: Action.ADD_PROJECT_DONE,
    }
}

export function requestProjectList() {
    return {
        type: Action.REQUEST_PROJECT_LIST,
    }
}

export function fetchProjectList() {
    return dispatch => {
        dispatch(requestProjectList())
        return client.getProjectList().then(list => {
            dispatch(openAddProjectDialog(false))
            dispatch(receiveProjectList(list))
        })
    }
}

export function receiveProjectList(list) {
    return  {
        type: Action.RECEIVE_PROJECT_LIST,
        list,
    }
}

export function sendProject(name: string, description: string) {
    return dispatch => {
        dispatch(addProject(name, description));
        return client.createProject(name, description).then(prjId => {
            dispatch(addProjectDone());
            return dispatch(fetchProjectList())
        })
    }
}
