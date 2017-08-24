const shell = require("node-powershell");
const Source = require("./source");

const toJsonCommand = " | ConvertTo-Json -Compress";

class PSCommand extends Source {
    constructor(sourceName = "ps-command", config = {}) {
        super(sourceName);

        this._configuration = {
            debugMsg: false
        };

        Object.assign(this._configuration, config);
    }

    // TODO: weigh up overhead of creating shell for every exec vs keep 1 alive.
    async exec(commandString, toJson = true) {
        let ps, data;

        try {
            ps = new shell(this._configuration);
            ps.addCommand(`${commandString}${toJson ? toJsonCommand : ""}`);
            data = await ps.invoke();
        } finally {
            ps.dispose();
        }

        if (toJson) {
            data = JSON.parse(data);
        }

        return data;
    }

    async available() {
        let ps,
            shellPresent = true;

        try {
            ps = new shell(this._configuration);
        } catch (err) {
            shellPresent = false;
        } finally {
            ps.dispose();
        }

        return shellPresent;
    }
}

module.exports = PSCommand;
