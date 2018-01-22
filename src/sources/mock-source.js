const ItemConfiguration = require("../items/item-configuration"),
  Record = require("../measures/record"),
  Source = require("./source");

const sourceName = "mock-source";

class MockSource extends Source {
    constructor() {
        super(sourceName);
    }

    async available() {
        // the mock is only available in dev
        return process.env.NODE_ENV !== "production";
    }

    async getInstances(itemName, instances) {
        let itemConfigurations = [];

        switch (itemName) {
            case "cpu":
                // single item
                itemConfigurations.push(new ItemConfiguration(
                    itemName,
                    "CPU 1"
                ));
                break;
            case "gpu":
                // multiple items
                itemConfigurations.push(
                    new ItemConfiguration(itemName, "GPU 1"),
                    new ItemConfiguration(itemName, "GPU 2")
                );
                break;
            case "gpu-memory":
            case "ram":
            case "disk":
            default:
                // any other item the mock doesnt support.
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
        item.measures.map(measure => {
            switch (measure.name) {
                case "temperature":
                    measure.records = [new Record("Temperature 1", 50)];
                    break;
                case "utilisation":
                    measure.records = [
                        new Record("Utilisation 1", 10),
                        new Record("Utilisation 2", 5)
                    ]
                    break;
                case "speed":
                default:
                    // not supported
                    break;
            }
        })
    }
}

module.exports = MockSource;
