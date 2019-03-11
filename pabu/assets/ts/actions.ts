import client from "./client";

import {Action as RAction, ActionCreator, Dispatch} from 'redux';
import {ThunkAction} from 'redux-thunk';

export enum Action {
    ADD_PROJECT = 'ADD_PROJECT',
    ADD_PROJECT_DONE = 'ADD_PROJECT_DONE',
    REQUEST_PROJECTS = 'REQUEST_PROJECTS',
    RECEIVE_PROJECTS = 'RECEIVE_PROJECTS',
    OPEN_ADD_PROJECT_DIALOG = 'OPEN_ADD_PROJECT_DIALOG',
    OPEN_ADD_ISSUE_DIALOG = 'OPEN_ADD_ISSUE_DIALOG',
    OPEN_ADD_TIME_DIALOG = 'OPEN_ADD_TIME_DIALOG',
}

export function openAddProjectDialog(isOpen = true){
    return {
        type: Action.OPEN_ADD_PROJECT_DIALOG,
        isOpen,
    }
}

export function openAddIssueDialog(isOpen = true){
    return {
        type: Action.OPEN_ADD_ISSUE_DIALOG,
        isOpen,
    }
}

export function openAddTimeDialog(isOpen = true){
    return {
        type: Action.OPEN_ADD_TIME_DIALOG,
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

export function requestProjects(id: number = null) {
    return {
        type: Action.RECEIVE_PROJECTS,
        id,
    }
}

export function fetchProjects(id: number = null) {
    return dispatch => {
        dispatch(requestProjects(id))
        return client.getProjects(id).then(data => {
            dispatch(receiveProjects(data))
        })
    }
}

export function receiveProjects(data) {
    return  {
        type: Action.RECEIVE_PROJECTS,
        data,
    }
}

export function sendProject(name: string, description: string) {
    return dispatch => {
        dispatch(addProject(name, description));
        return client.createProject(name, description).then(project => {
            dispatch(addProjectDone());
            dispatch(openAddProjectDialog(false))
            return dispatch(receiveProjects({[project.id]: project}))
        })
    }
}

export function sendIssue(name: string, description: string, projectId: number) {
    return dispatch => {
        return client.createIssue(name, description, projectId).then(prjId => {
            dispatch(openAddIssueDialog(false))
            return dispatch(fetchProjects(projectId))
        })
    }
}

export function sendTime(projectId: number, start: Date, issueId: number = null, end: Date = null) {
    return dispatch => {
        return client.addTime(projectId, start, issueId, end).then(() => {
        })
    }
}
