const WMIQuery = require("./wmi-query"),
    ItemConfiguration = require("../items/item-configuration"),
    Record = require("../measures/record");

const measureClass = "Sensor",
    itemClass = "Hardware",
    namespace = "ROOT/OpenHardwareMonitor",
    sourceName = "open-hw-mon-wmi";

class OpenHWMonWMI extends WMIQuery {
    constructor() {
        super(sourceName, namespace, itemClass); // TODO: not sure I like the behaviour of setting namespace/class then query uses the internal state. state should be passed in.
    }

    async available() {
        let available = false,
            result = await this.query();

        // if we have a returned hardware array then openhardwaremonitor is present and running.
        if (Array.isArray(result) && result.length > 0) {
            available = true;
        }

        return available;
        // TODO: log if not present how to enable.
    }

    async getInstances(itemName, instances) {
        this.className = itemClass;

        let hwInstances = await this.query(["HardwareType", "Identifier"]),
            itemConfigurations = [];

        switch (itemName) {
            case "cpu":
                // just get the cpu hardware records
                let cpuHwInstances = hwInstances.filter(
                    hwInstance => hwInstance.HardwareType === "CPU"
                );

                itemConfigurations = this._processItemInstances(
                    itemName,
                    instances,
                    cpuHwInstances
                );

                break;
            case "gpu":
            case "gpu-memory": // hw mon returns info under the same GPU node so fallthrough
                // just get the gpu hardware records, returned as 'GpuNvidia'
                let gpuHwInstances = hwInstances.filter(hwInstance =>
                    hwInstance.HardwareType.match(/gpu/i)
                );

                itemConfigurations = this._processItemInstances(
                    itemName,
                    instances,
                    gpuHwInstances
                );
                break;
            case "ram":
                let ramHwInstances = hwInstances.filter(
                    hwInstance => hwInstance.HardwareType === "RAM"
                );

                // can only return 1 ram instance
                if (ramHwInstances) {
                    itemConfigurations = [
                        new ItemConfiguration(
                            itemName,
                            ramHwInstances[0].Identifier
                        )
                    ];
                }
                break;
            case "disk":
                let diskHwInstances = hwInstances.filter(
                    hwInstance => hwInstance.HardwareType === "HDD"
                );

                itemConfigurations = this._processItemInstances(
                    itemName,
                    instances,
                    diskHwInstances
                );
                break;
            default:
                // any other item open hw mon doesnt support.
                break;
        }

        // return the items configuration if supported.
        if (itemConfigurations.length) {
            return itemConfigurations;
        } else {
            // explicitly returning undefined to show we dont support the item.
            return undefined;
        }
    }

    async getData(item) {
        this.className = measureClass;
        let data = await this.query(["Name", "Parent", "SensorType", "Value"]);

        // only get the item measurements we are interested in.
        data = data.filter(record => record.Parent === item.identifier);

        // we can kick all data requests off in parallel.
        await Promise.all(
            item.measures.map(async measure => {
                switch (measure.name) {
                    case "temperature":
                        measure.records = this._dataForMeasure(
                            "Temperature",
                            data
                        );
                        break;
                    case "utilisation":
                        measure.records = this._dataForMeasure("Load", data);
                        break;
                    case "speed":
                        measure.records = this._dataForMeasure("Clock", data);
                        break;
                    default:
                        break;
                }
            })
        );
    }

    _dataForMeasure(measure, data) {
        return data
            .filter(record => record.SensorType === measure)
            .map(record => new Record(record.Name, record.Value));
    }

    // TODO: add named instances.
    _processItemInstances(itemName, instances, hwInstances) {
        let itemConfigurations;

        if (instances[0] === "all") {
            // return all cpu hardware records
            itemConfigurations = hwInstances.map(
                hwInstance =>
                    new ItemConfiguration(itemName, hwInstance.Identifier)
            );
        } else {
            // find all hardware records which match the requested instances.
            // indentifiers returned as '/<hardware>/0', so use last char as instance number
            itemConfigurations = hwInstances
                .filter(hwInstance =>
                    instances.some(
                        instance =>
                            hwInstance.Identifier.substr(-1) === (instance - 1) // instance 0 is configured as instance 1 in the config file
                    )
                )
                .map(
                    hwInstance =>
                        new ItemConfiguration(itemName, instance.Identifier)
                );
        }

        return itemConfigurations;
    }
}

module.exports = OpenHWMonWMI;
