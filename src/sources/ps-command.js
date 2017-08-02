const shell = require("node-powershell");

const toJsonCommand = " | ConvertTo-Json -Compress";

export default class PSCommand {
    constructor(config={}) {
        this._configuration = {
            debugMsg: false
        };

        Object.assign(this._configuration, config);
    }

    async exec(commandString, toJson=true) {
        let ps, data;

        try {
            ps = new shell(this._configuration);            
            ps.addCommand(`${commandString}${toJson ? toJsonCommand : ''}`);
            data = await ps.invoke();
        } finally {
            ps.dispose();
        }

        if (toJson) {
            data = JSON.parse(data);
        }

        return data;
    }
}