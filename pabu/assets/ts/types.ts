import { ThunkDispatch } from "redux-thunk";
import { Action } from "redux";

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
    count: number,
}

export interface ServerIssueData {
    id?: number,
    name?: string,
    desc?: string,
    projectId?: number,
    userId?: number,
    status?: string,
    rank?: number,
}

export interface PabuModel {
    id: number,
}

export interface Project extends PabuModel {
    name: string,
    desc: string,
    issues: Array<number>,
    users: Array<number>,
    payments: Array<number>,
    tokens: Array<number>,
    timeStat: TimeSummary,
    paid: number,
}

export enum IssueStatus {
    TODO = 'todo',
    IN_PROGRESS = 'in progress',
    DONE = 'done',
}

export interface Issue extends PabuModel {
    name: string,
    desc: string,
    projectId: number,
    timeEntries: Array<number>,
    timeStat: TimeSummary,
    status: IssueStatus,
    rank: number,
}

export interface TimeEntry extends PabuModel {
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
    time: string,
}

export interface Payment extends PabuModel {
    projectId: number,
    createdUserId: number,
    paidUserId: number,
    amount: number,
    time: number,
    note: string,
}

export interface ProjectInvitationToken extends PabuModel {
    projectId: number,
    token: string,
}

export interface ExpandedPayment extends Payment {
    createdUserName: string,
    paidUserName: string,
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
export type PaymentMap = { [n: number]: Payment };
export type ProjectInvitationTokenMap = { [n: number]: ProjectInvitationToken };

export type ProjectDialogContext = {id?: number};
export type IssueDialogContext = {projectId: number, id?: number};
export type TimeDialogContext = {projectId: number, issueId: number};
export type IssueByStatusMap = { [s: string ]: Array<Issue> };

export interface Store {
    addTimeDialogContext: TimeDialogContext,
    fetchingProject: boolean,
    isDarkTheme: boolean,
    issueDialogContext: IssueDialogContext,
    issues: IssueMap,
    openedProjectId: number,
    paymentDialogProjectId: number,
    payments: PaymentMap,
    projectDialogContext: ProjectDialogContext,
    projects: ProjectMap,
    tickingStat: TickingStat,
    timeEntries: TimeEntryMap,
    users: UserMap,
    projectInvitationTokens: ProjectInvitationTokenMap,
    inviteDialogIsOpen: boolean,
}

export type ThunkDispatcher = ThunkDispatch<{}, undefined, Action>;

export type IssueListLayout = 'list' | 'card';

export type IssueStatusFilterStatusMap = {
    [IssueStatus.TODO]: boolean,
    [IssueStatus.IN_PROGRESS]: boolean,
    [IssueStatus.DONE]: boolean,
}

export class LocalStorageSchema {
    openedProjectId: number = 0;
    isDarkTheme: boolean = false;
    openedProjectTab: number = 0;
    issueListLayout: IssueListLayout = 'list';
    issueTableFilters: IssueStatusFilterStatusMap = {
        [IssueStatus.TODO]: true,
        [IssueStatus.IN_PROGRESS]: true,
        [IssueStatus.DONE]: false,
    };
}
