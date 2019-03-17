import { ThunkAction, ThunkDispatch } from "redux-thunk";
import { Action } from "redux";

export enum LocalStorageKey {
    OPENED_PROJECTID = 'OPENED_PROJECTID',
    IS_DARK_THEME  = 'IS_DARK_THEME',
}

export interface UserInfo {
    name: string,
    email: string,
    providerName: string,
    picture?: string,
}

export interface ApplicationData {
    isLoggedIn: boolean,
    userInfo: UserInfo,
    authBackendNames: Array<string>,
}

export interface User {
    id: number,
}

export interface TimeSummary {
    spent: number,
    lastEntry: number,
}

export interface Project {
    id: number,
    name: string,
    desc: string,
    issues: Array<number>,
    users: Array<number>,
    timeStat: TimeSummary,
    paid: number,
}

export interface Issue {
    id: number,
    name: string,
    desc: string,
    projectId: number,
    timeEntries: Array<number>,
    timeStat: TimeSummary,
}

export interface TimeEntry {
    id: number,
    issueId: number,
    projectId: number,
    start: number,
    end: number,
    userId: number,
}

export interface ExpandedTimeEntry extends TimeEntry {
    issueName: string,
    userName: string,
    spentHours: number,
}

export interface User {
    id: number,
    name: string,
}

export interface PaymentSubmitData {
    user_id: number,
    amount: string,
    note: string,
}

export interface Payment {
    id: number,
    project_id: number,
    payer_user_id: number,
    paid_user_id: number,
    amount: number,
    time: number,
    note: string,
}

export interface TickingStat {
    ticking: boolean,
    entry?: TimeEntry,
}

export type ProjectSubmitCallback = (id: number, name: string, desc: string) => void;
export type NameDescSubmitCallback = (name: string, desc: string) => void;
export type TimeEntrySubmitCallback = (projectId: number, start: Date, issueId?: number, end?: Date) => void;

export type ProjectMap = { [n: number]: Project };
export type IssueMap = { [n: number]: Issue };
export type TimeEntryMap = { [n: number]: TimeEntry };
export type UserMap = { [n: number]: User };

export type ProjectDialogContext = {id?: number};
export type IssueDialogContext = {projectId: number, id?: number};
export type TimeDialogContext = {projectId: number, issueId: number};

export interface Store {
    addTimeDialogContext: TimeDialogContext,
    fetchingProject: boolean,
    isDarkTheme: boolean,
    issueDialogContext: IssueDialogContext,
    issues: IssueMap,
    openedProjectId: number,
    paymentDialogProjectId: number,
    projectDialogContext: ProjectDialogContext,
    projects: ProjectMap,
    tickingStat: TickingStat,
    timeEntries: TimeEntryMap,
    users: UserMap,
}

export type ThunkDispatcher = ThunkDispatch<{}, undefined, Action>;
