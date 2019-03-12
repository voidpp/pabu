import { Project } from "./types";

class PabuClient {

    private _path: string;

    constructor() {
        this._path = '/api/'
    }

    private async _send(method: string, params: Array<any> = []) {
        let payload = {
            method: method,
            id : new Date().getTime(),
            jsonrpc : "2.0",
            params: params
        }

        const resp = await fetch(this._path, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });
        const data = await resp.json();
        if (data.error) {
            console.error(data.error)
            throw new Error('server error');
        }
        return data.result;
    }

    async getProjects(id: number = null) {
        return this._send('get_projects', [id]);
    }

    async getIssues(project_id: number) {
        return this._send('get_issues', [project_id]);
    }

    async createProject(name: string, description: string): Promise<Project> {
        return this._send('create_project', [name, description]);
    }

    async createIssue(name: string, description: string, projectId: number) {
        return this._send('create_issue', [name, description, projectId]);
    }

    async addTime(projectId: number, start: Date, issueId: number = null, end: Date = null) {
        return this._send('add_time', [projectId, start, issueId, end]);
    }
}

export default new PabuClient();
