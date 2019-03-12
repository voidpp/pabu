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
    paid: number,
    ongoing: boolean
}

export interface Project {
    id: number,
    name: string,
    desc: string,
    issues: Array<number>,
    timeStat: TimeSummary,
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

export type ProjectSubmitCallback = (nane: string, desc: string) => void;

export type NameDescSubmitCallback = (nane: string, desc: string) => void;

export type TimeEntrySubmitCallback = (projectId: number, start: Date, issueId?: number, end?: Date) => void;

export type ProjectMap = { [n: number]: Project };
export type IssueMap = { [n: number]: Issue };
export type TimeEntryMap = { [n: number]: TimeEntry };

export type TimeDialogContext = {projectId: number, issueId: number};

export interface State {
    creatingNewProject: boolean,
    fetchingProject: boolean,
    projects: ProjectMap,
    issues: IssueMap,
    addProjectDialogIsOpen: boolean,
    addTimeDialogContext: TimeDialogContext,
    addIssueDialogProjectId: number,
    openedProjectId: number,
}
