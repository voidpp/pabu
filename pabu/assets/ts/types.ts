
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
}

export type ProjectSubmitCallback = (nane: string, desc: string) => void;

export interface State {
    creatingNewProject: boolean,
    fetchingProject: boolean,
    projectList: Array<Project>,
    addProjectDialogIsOpen: boolean,
}
