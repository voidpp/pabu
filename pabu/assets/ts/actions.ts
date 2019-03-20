import client from "./client";

import { TickingStat, PaymentSubmitData, LocalStorageKey, Issue } from "./types";

export enum Action {
    CLOSE_ISSUE_DIALOG = 'CLOSE_ADD_ISSUE_DIALOG',
    CLOSE_ADD_TIME_DIALOG = 'CLOSE_ADD_TIME_DIALOG',
    CLOSE_PROJECT_DIALOG = 'CLOSE_PROJECT_DIALOG',
    CLOSE_PAYMENT_DIALOG = 'CLOSE_PAYMENT_DIALOG',
    CLOSE_PROJECT = 'CLOSE_PROJECT',
    CLOSE_INVITE_DIALOG = 'CLOSE_INVITE_DIALOG',
    DELETE_PROJECT = 'DELETE_PROJECT',
    DELETE_ISSUE = 'DELETE_ISSUE',
    DELETE_TIME_ENTRY = 'DELETE_TIME_ENTRY',
    DELETE_PAYMENT = 'DELETE_PAYMENT',
    DELETE_PROJECT_TOKEN = 'DELETE_PROJECT_TOKEN',
    OPEN_ISSUE_DIALOG = 'OPEN_ISSUE_DIALOG',
    OPEN_INVITE_DIALOG = 'OPEN_INVITE_DIALOG',
    OPEN_PROJECT_DIALOG = 'OPEN_PROJECT_DIALOG',
    OPEN_ADD_TIME_DIALOG = 'OPEN_ADD_TIME_DIALOG',
    OPEN_PAYMENT_DIALOG = 'OPEN_PAYMENT_DIALOG',
    OPEN_PROJECT = 'OPEN_PROJECT',
    RECEIVE_ISSUES = 'RECEIVE_ISSUES',
    RECEIVE_TIME_ENTRIES = 'RECEIVE_TIME_ENTRIES',
    RECEIVE_PROJECTS = 'RECEIVE_PROJECTS',
    RECEIVE_TICKING_STAT = 'RECEIVE_TICKING_STAT',
    RECEIVE_USERS = 'RECEIVE_USERS',
    RECEIVE_PAYMENTS = 'RECEIVE_PAYMENTS',
    RECEIVE_PROJECT_TOKENS = 'RECEIVE_PROJECT_TOKENS',
    REQUEST_PROJECTS = 'REQUEST_PROJECTS',
    SET_DARK_THEME = 'SET_DARK_THEME',
}

export function fetchAllProjectData(id: number) {
    return dispatch => {
        dispatch(fetchProjects(id))
        dispatch(fetchIssues(id))
        dispatch(fetchTimeEntries(id))
        dispatch(fetchProjectUsers(id))
        dispatch(fetchPayments(id))
        dispatch(fetchProjectTokens(id))
    }
}

export function openProject(id: number) {
    return dispatch => {
        window.localStorage.setItem(LocalStorageKey.OPENED_PROJECTID, id.toString());
        dispatch(fetchAllProjectData(id));
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

export function openInviteDialog() {
    return {
        type: Action.OPEN_INVITE_DIALOG,
    }
}

export function closeInviteDialog() {
    return {
        type: Action.CLOSE_INVITE_DIALOG,
    }
}

export function joinToProject(token: string) {
    return dispatch => client.joinToProject(token);
}

export function kickUserFromProject(projectId: number, userId: number) {
    return dispatch => client.kickUserFromProject(projectId, userId);
}

export function leaveProject(projectId: number) {
    return dispatch => client.leaveProject(projectId).then(() => {
        dispatch({
            type: Action.DELETE_PROJECT,
            id: projectId,
        })
        return new Promise((resolve, reject) => resolve())
    });
}

export function openProjectDialog(id: number = null) {
    return {
        type: Action.OPEN_PROJECT_DIALOG,
        context: {id},
    }
}

export function closeProjectDialog() {
    return {
        type: Action.CLOSE_PROJECT_DIALOG,
    }
}

export function openIssueDialog(projectId: number, id: number = null){
    return {
        type: Action.OPEN_ISSUE_DIALOG,
        context: {projectId, id},
    }
}

export function closeIssueDialog() {
    return {
        type: Action.CLOSE_ISSUE_DIALOG,
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
export function fetchProjectTokens(projectId: number) {
    return dispatch => {
        return client.getProjectTokens(projectId).then(data => {
            dispatch(receiveProjectTokens(data))
        })
    }
}

export function fetchTimeEntries(projectId: number) {
    return dispatch => client.getTimeEntries(projectId).then(data => dispatch(receiveTimeEntries(data)))
}

export function fetchPayments(projectId: number) {
    return dispatch => client.getPayments(projectId).then(data => dispatch(receivePayments(data)))
}

export function receiveProjectTokens(data) {
    return  {
        type: Action.RECEIVE_PROJECT_TOKENS,
        data,
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

export function receiveTimeEntries(data) {
    return  {
        type: Action.RECEIVE_TIME_ENTRIES,
        data,
    }
}

export function receivePayments(data) {
    return  {
        type: Action.RECEIVE_PAYMENTS,
        data,
    }
}

export function sendProject(name: string, description: string, id: number = null) {
    return () => id ? client.updateProject(id, name, description) : client.createProject(name, description);
}


export function sendIssue(name: string, description: string, projectId: number, id: number = null) {
    return dispatch => id ? client.updateIssue(id, name, description, projectId) : client.createIssue(name, description, projectId)
}

export function sendTime(projectId: number, time: string, amount: string, issueId: number = null) {
    return dispatch => {
        return client.addTime(projectId, amount, time, issueId).then(() => {
            dispatch(closeAddTimeDialog())
            dispatch(fetchAllProjectData(projectId));
        })
    }
}

export function createProjectToken(projectId: number) {
    return dispatch => client.createProjectToken(projectId).then(t => dispatch(receiveProjectTokens({[t.id]: t})));
}

export function deleteProjectToken(id: number) {
    return dispatch => client.deleteProjectToken(id).then(() => {
        dispatch({
            type: Action.DELETE_PROJECT_TOKEN,
            id,
        })
    });
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
            dispatch(fetchTimeEntries(projectId))
        })
    }
}

export function stopTime(openedProjectId: number) {
    return dispatch => {
        return client.stopTime().then(() => {
            dispatch(fetchTickingStat())
            dispatch(fetchProjects(openedProjectId))
            dispatch(fetchTimeEntries(openedProjectId))
        })
    }
}

export function sendPayment(projectId: number, data: PaymentSubmitData) {
    return dispatch => {
        return client.addPayment(projectId, data.amount, data.user_id, data.time, data.note).then(res => {
            dispatch(closePaymentDialog())
            dispatch(fetchAllProjectData(projectId));
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

export function deletePayment(id: number) {
    return dispatch => client.deletePayment(id).then(() => {
        dispatch({
            type: Action.DELETE_PAYMENT,
            id,
        })
        return new Promise((resolve, reject) => resolve())
    })
}

export function deleteTimeEntry(id: number) {
    return dispatch => client.deleteTimeEntry(id).then(() => {
        dispatch({
            type: Action.DELETE_TIME_ENTRY,
            id,
        })
        return new Promise((resolve, reject) => resolve())
    })
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

export function setDarkTheme(isSet: boolean) {
    window.localStorage.setItem(LocalStorageKey.IS_DARK_THEME, isSet ? '1' : '0')
    return {
        type: Action.SET_DARK_THEME,
        isSet,
    }
}
