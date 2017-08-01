import { wmi } from "node-wmi";

export default class OpenHWMonRepository {
    constructor() {
        this._namespace = "ROOT/OpenHardwareMonitor";
    }

    
}

wmi.Query(
    {
        namespace: "ROOT/OpenHardwareMonitor",
        class: "Hardware"
    },
    function(err, res) {
        console.log(res);
    }
);
