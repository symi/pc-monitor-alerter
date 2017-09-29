const wmi = require("node-wmi");

wmi.Query(
    {
        namespace: "ROOT/OpenHardwareMonitor",
        class: "Hardware",
        properties: ["HardwareType", "Identifier"]
    },
    function(err, res) {
        console.log(res);
    }
);
