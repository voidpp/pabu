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

    async getProjectUsers(project_id: number) {
        return this._send('get_project_users', [project_id]);
    }

    async createProject(name: string, description: string): Promise<Project> {
        return this._send('create_project', [name, description]);
    }

    async createIssue(name: string, description: string, projectId: number) {
        return this._send('create_issue', [name, description, projectId]);
    }

    async addTime(projectId: number, amount:string, issueId: number = null) {
        return this._send('add_time', [projectId, amount, issueId]);
    }

    async startTime(projectId: number, issueId: number = null) {
        return this._send('start_time', [projectId, issueId]);
    }

    async addPayment(projectId: number, amount: string, paidUserId: number, note: string) {
        return this._send('add_payment', [projectId, amount, paidUserId, note]);
    }

    async stopTime() {
        return this._send('stop_time');
    }

    async deleteProject(id: number) {
        return this._send('delete_project', [id]);
    }

    async deleteIssue(id: number) {
        return this._send('delete_issue', [id]);
    }

    async getTickingStat() {
        return this._send('get_ticking_stat');
    }
}

export default new PabuClient();
