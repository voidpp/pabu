import { number } from "prop-types";

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
    ongoing: boolean
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
    start: Date,
    end: Date,
}

export interface User {
    id: number,
    name: number,
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

export type ProjectSubmitCallback = (nane: string, desc: string) => void;
export type NameDescSubmitCallback = (nane: string, desc: string) => void;
export type TimeEntrySubmitCallback = (projectId: number, start: Date, issueId?: number, end?: Date) => void;

export type ProjectMap = { [n: number]: Project };
export type IssueMap = { [n: number]: Issue };
export type TimeEntryMap = { [n: number]: TimeEntry };
export type UserMap = { [n: number]: User };

export type TimeDialogContext = {projectId: number, issueId: number};

export interface State {
    creatingNewProject: boolean,
    fetchingProject: boolean,
    projects: ProjectMap,
    issues: IssueMap,
    users: UserMap,
    addProjectDialogIsOpen: boolean,
    addTimeDialogContext: TimeDialogContext,
    addIssueDialogProjectId: number,
    paymentDialogProjectId: number,
    openedProjectId: number,
    tickingStat: TickingStat,
}
