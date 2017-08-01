//import config from "config/config";

//const intervalId = window.setInterval()

const { promisify } = require("util");
const exec = promisify(require("child_process").exec);
const xmlStringParser = promisify(new require("xml2js").Parser().parseString);
const shell = require("node-powershell");
const moment = require("moment");

async function dir() {
    let { stdout, stderr } = await exec("wevtutil gl System /f:XML");

    let data = await xmlStringParser(stdout);

    console.log(`stdout: ${stdout}`);
    console.log(`stderr: ${stderr}`);
    console.log(`System loggin enabled: ${data.channel.$.enabled}`);

    if (data.channel.$.enabled) {
        let ps;
        try {
            ps = new shell({ debugMsg: false });

            ps.addCommand(
                `Get-WinEvent -FilterHashTable @{Logname='System'; Level=2; StartTime='${moment()
                    .subtract(1, "d")
                    .toISOString()}'} | ConvertTo-Json -Compress`
            );

            stdout = await ps.invoke();
        } finally {
            ps.dispose();
        }
        data = JSON.parse(stdout);

        data = Array.isArray(data) ? data[0] : data;

        console.log(
            data.ProviderName,
            data.Message,
            data.Level,
            data.LevelDisplayName,
            new Date(parseInt(data.TimeCreated.substr(6))),
            JSON.parse(stdout).length || 0
        );
    }
}

dir();
