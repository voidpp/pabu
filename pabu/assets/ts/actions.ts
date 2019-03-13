import client from "./client";

import { TickingStat, PaymentSubmitData, OPENED_PROJECTID_LOCAL_STORAGE_KEY_NAME } from "./types";

export enum Action {
    ADD_PROJECT = 'ADD_PROJECT',
    ADD_PROJECT_DONE = 'ADD_PROJECT_DONE',
    CLOSE_ADD_ISSUE_DIALOG = 'CLOSE_ADD_ISSUE_DIALOG',
    CLOSE_ADD_TIME_DIALOG = 'CLOSE_ADD_TIME_DIALOG',
    CLOSE_PAYMENT_DIALOG = 'CLOSE_PAYMENT_DIALOG',
    CLOSE_PROJECT = 'CLOSE_PROJECT',
    DELETE_PROJECT = 'DELETE_PROJECT',
    DELETE_ISSUE = 'DELETE_ISSUE',
    OPEN_ADD_ISSUE_DIALOG = 'OPEN_ADD_ISSUE_DIALOG',
    OPEN_ADD_PROJECT_DIALOG = 'OPEN_ADD_PROJECT_DIALOG',
    OPEN_ADD_TIME_DIALOG = 'OPEN_ADD_TIME_DIALOG',
    OPEN_PAYMENT_DIALOG = 'OPEN_PAYMENT_DIALOG',
    OPEN_PROJECT = 'OPEN_PROJECT',
    RECEIVE_ISSUES = 'RECEIVE_ISSUES',
    RECEIVE_PROJECTS = 'RECEIVE_PROJECTS',
    RECEIVE_TICKING_STAT = 'RECEIVE_TICKING_STAT',
    RECEIVE_USERS = 'RECEIVE_USERS',
    REQUEST_PROJECTS = 'REQUEST_PROJECTS',
}

export function openProject(id: number) {
    return dispatch => {
        window.localStorage.setItem(OPENED_PROJECTID_LOCAL_STORAGE_KEY_NAME, id.toString());
        dispatch(fetchIssues(id))
        dispatch({
            type: Action.OPEN_PROJECT,
            id,
        })
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

export function openPaymentDialog(projectId: number){
    return dispatch => {
        dispatch({
            type: Action.OPEN_PAYMENT_DIALOG,
            projectId,
        })
        return client.getProjectUsers(projectId).then(data => {
            dispatch(receiveUsers(data))
        })
    }
}

export function closePaymentDialog(){
    return {
        type: Action.CLOSE_PAYMENT_DIALOG,
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

export function fetchProjects(id: number = null, ) {
    return dispatch => {
        dispatch(requestProjects(id))
        return client.getProjects(id).then(data => {
            dispatch(receiveProjects(data))
        })
    }
}

export function fetchProjectUsers(projectId: number) {
    return dispatch => {
        return client.getProjectUsers(projectId).then(data => {
            dispatch(receiveUsers(data))
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

export function receiveUsers(data) {
    return  {
        type: Action.RECEIVE_USERS,
        data,
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

export function receiveTickingStat(data: TickingStat) {
    return {
        type: Action.RECEIVE_TICKING_STAT,
        data,
    }
}

export function fetchTickingStat() {
    return dispatch => {
        return client.getTickingStat().then(data => {
            dispatch(receiveTickingStat(data))
        })
    }
}

export function startTime(projectId: number, issueId: number = null) {
    return dispatch => {
        return client.startTime(projectId, issueId).then(() => {
            dispatch(fetchTickingStat())
        })
    }
}

export function stopTime(openedProjectId: number) {
    return dispatch => {
        return client.stopTime().then(() => {
            dispatch(fetchTickingStat())
            dispatch(fetchProjects(openedProjectId))
        })
    }
}

export function sendPayment(projectId: number, data: PaymentSubmitData) {
    return dispatch => {
        return client.addPayment(projectId, data.amount, data.user_id, data.note).then(res => {
            dispatch(closePaymentDialog())
            dispatch(fetchProjects(projectId))
        })
    }
}

export function deleteProject(id: number) {
    return dispatch => {
        return client.deleteProject(id).then(() => {
            dispatch(fetchProjects())
            dispatch({
                type: Action.DELETE_PROJECT,
                id,
            })
        })
    }
}

export function deleteIssue(id: number, openedProjectId: number) {
    return dispatch => {
        return client.deleteIssue(id).then(() => {
            dispatch({
                type: Action.DELETE_ISSUE,
                id,
            })
            dispatch(fetchProjects(openedProjectId))
        })
    }
}
