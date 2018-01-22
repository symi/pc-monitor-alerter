const sysinfo = require("systeminformation"),
    { converterBase2 } = require("byte-converter"),
    { partialRight, countBy, transform } = require('lodash'),
    Source = require("./source"),
    ItemConfiguration = require("../items/item-configuration"),
    Record = require("../measures/record");

const sourceName = "system-information",
    B2GB = partialRight(converterBase2, "B", "GB");

class SystemInformation extends Source {
    constructor() {
        super(sourceName);
    }

    async available() {
        return typeof sysinfo === "object";
    }

    async getInstances(itemName, instances) {
        let itemConfigurations = [];
        
        switch (itemName) {
            case "cpu":
                // system-information only returns 1 cpu
                const { manufacturer, brand } = await sysinfo.cpu();

                itemConfigurations.push(new ItemConfiguration(
                    itemName,
                    `${manufacturer} ${brand}`
                ));
                break;
            case "ram":
                // system-information only returs usage data as an overall
                // get name from type and size
                const mem = await sysinfo.memLayout();
                const identifier = transform(
                    countBy(mem.map(m => `${B2GB(m.size)}GB ${m.type}`)),
                    (result, value, key) => result.push(`${value}x${key}`),
                    []
                ).join('+');

                itemConfigurations.push(new ItemConfiguration(
                    itemName,
                    identifier
                ));
                break;
            case "disk":
                // TODO: implement these
                break;
            case "gpu":
            case "gpu-memory":
            default:
                // any other item system-information doesnt support.
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
        // we can kick all data requests off in parallel.
        await Promise.all(
            item.measures.map(async measure => {
                switch (measure.name) {
                    case "temperature":
                        const tempRecords = [];
                        switch (item.name) {
                            case "cpu":
                                const temps = await sysinfo.cpuTemperature();
                                tempRecords.push(new Record("Package", temps.main));
                                temps.cores.forEach((coreTemp, index) => {
                                    tempRecords.push(new Record(`Core #${index}`, coreTemp));
                                });
                                measure.records = tempRecords;
                                break;
                            default:
                                break;
                        }
                        break;
                    case "utilisation":
                    case "speed":
                        // TODO: implement these
                        break;
                    default:
                        break;
                }
            })
        );
    }
}

module.exports = SystemInformation;