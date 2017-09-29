const ConfigurationBuilder = require("./src/configurations/configuration-builder");
const path = require("path");

(async () => {
    try {
    let builder = new ConfigurationBuilder(
            path.resolve(__dirname, "./config/config.json")
        ),
        configuration = await builder.getConfiguration();


        configuration.runners.forEach(runner => runner.start());
    } catch (err) {
        console.error(err);
    }
})();
/*
//import config from "config/config";

//const intervalId = window.setInterval()

const { promisify } = require("util");
const exec = promisify(require("child_process").exec);
const xmlStringParser = promisify(new require("xml2js").Parser().parseString);
const shell = require("node-powershell");
const moment = require("moment");
const wmi = require("node-wmi");
const diskCheck = promisify(require("diskusage").check);
const byteConverter = require("byte-converter").converterBase2;
const os = require("os");

//console.log(byteConverter(os.freemem(), "B", "GB"));

wmi.Query(
    {
        namespace: "ROOT/OpenHardwareMonitor",
        class: "Hardware"
    },
    function(err, res) {
        console.log(res);
    }
);
// "Get-WmiObject -namespace ROOT\CIMV2\Applications\Avira_AntiVir -class Product_Info | Select-Object Last_Scan_Date,Last_Update_Date | ConvertTo-Json -Compress"

async function space() {
    const { available, free, total } = await diskCheck("c:"); //wmic logicaldisk get caption

    console.log(
        byteConverter(available, "B", "GB"),
        byteConverter(free, "B", "GB"),
        byteConverter(total, "B", "GB")
    );
}

//space();

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

//dir();
*/