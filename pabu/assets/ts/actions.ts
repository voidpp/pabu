import client from "./client";

import {Action as RAction, ActionCreator, Dispatch} from 'redux';
import {ThunkAction} from 'redux-thunk';

export enum Action {
    ADD_PROJECT = 'ADD_PROJECT',
    ADD_PROJECT_DONE = 'ADD_PROJECT_DONE',
    REQUEST_PROJECTS = 'REQUEST_PROJECTS',
    RECEIVE_PROJECTS = 'RECEIVE_PROJECTS',
    RECEIVE_ISSUES = 'RECEIVE_ISSUES',
    OPEN_ADD_PROJECT_DIALOG = 'OPEN_ADD_PROJECT_DIALOG',
    OPEN_ADD_ISSUE_DIALOG = 'OPEN_ADD_ISSUE_DIALOG',
    CLOSE_ADD_ISSUE_DIALOG = 'CLOSE_ADD_ISSUE_DIALOG',
    OPEN_ADD_TIME_DIALOG = 'OPEN_ADD_TIME_DIALOG',
    CLOSE_ADD_TIME_DIALOG = 'CLOSE_ADD_TIME_DIALOG',
    OPEN_PROJECT = 'OPEN_PROJECT',
    CLOSE_PROJECT = 'CLOSE_PROJECT',
}

export function openProject(id: number){
    return {
        type: Action.OPEN_PROJECT,
        id,
    }
}

export function closeProject() {
    return {
        type: Action.CLOSE_PROJECT,
    }
}

export function openAddProjectDialog(isOpen = true){
    return {
        type: Action.OPEN_ADD_PROJECT_DIALOG,
        isOpen,
    }
}

export function openAddIssueDialog(projectId: number){
    return {
        type: Action.OPEN_ADD_ISSUE_DIALOG,
        projectId,
    }
}

export function closeAddIssueDialog(){
    return {
        type: Action.CLOSE_ADD_ISSUE_DIALOG,
    }
}


export function openAddTimeDialog(projectId: number, issueId: number = null){
    return {
        type: Action.OPEN_ADD_TIME_DIALOG,
        projectId,
        issueId,
    }
}

export function closeAddTimeDialog(){
    return {
        type: Action.CLOSE_ADD_TIME_DIALOG,
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
            if (id == null && Object.values(data).length) {
                let prjId = parseInt(Object.keys(data)[0]);
                dispatch(openProject(prjId))
                dispatch(fetchIssues(prjId))
            }
        })
    }
}

export function fetchIssues(projectId: number) {
    return dispatch => {
        return client.getIssues(projectId).then(data => {
            dispatch(receiveIssues(data))
        })
    }
}

export function receiveProjects(data) {
    return  {
        type: Action.RECEIVE_PROJECTS,
        data,
    }
}

export function receiveIssues(data) {
    return  {
        type: Action.RECEIVE_ISSUES,
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
            dispatch(closeAddIssueDialog())
            dispatch(fetchProjects(projectId))
            dispatch(fetchIssues(projectId))
        })
    }
}

export function sendTime(projectId: number, amount: string, issueId: number = null) {
    return dispatch => {
        return client.addTime(projectId, amount, issueId).then(() => {
            dispatch(closeAddTimeDialog())
            dispatch(fetchProjects(projectId))
            dispatch(fetchIssues(projectId))
        })
    }
}
