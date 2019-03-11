
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

export interface Project {
    id: number,
    name: string,
    desc: string,
    issues: number,
}

export type ProjectSubmitCallback = (nane: string, desc: string) => void;
export type IssueSubmitCallback = (nane: string, desc: string, projectId: number) => void;

export type NameDescSubmitCallback = (nane: string, desc: string) => void;

export type ProjectMap = { [n: number]: Project };

export interface State {
    creatingNewProject: boolean,
    fetchingProject: boolean,
    projects: ProjectMap,
    addProjectDialogIsOpen: boolean,
    addIssueDialogIsOpen: boolean,
    addTimeDialogIsOpen: boolean,
}
