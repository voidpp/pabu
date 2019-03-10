
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

    async getProjectList() {
        return this._send('get_project_list');
    }

    async createProject(name: string, description: string) {
        return this._send('create_project', [name, description]);
    }
}

export default new PabuClient();
