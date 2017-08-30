const Watcher = require("./watcher");

class HwWatcher extends Watcher {
    constructor(itemName, measures, aggregates, instances = ["all"]) {
        super(itemName, measures, aggregates);
        this._instances = instances;
    }

    get instances() {
        return this._instances;
    }

    async getItems(sources) {
        let itemConfigurations;

        for (const source of sources) {
            itemConfigurations = await source.getInstances(
                this.itemName,
                this.instances
            );

            if (itemConfigurations) {
                this.items = itemConfigurations;
                break; // break as we have found our instances from a source
            }
        }
    }

    async getData(sources) {
        await this.getItems(sources);

        for (const item of this.items) {
            for (const source of sources) {
                await source.getData(item); // TODO: code smell - inversion of control here

                // populated will be true if the source had all the required info
                if (item.populated) {
                    break;
                }
            }
        }
    }

    static defaultMeasures(measures = []) {
        if (!Array.isArray(measures)) measures = [measures];

        if (measures[0] === "all" || !measures.length) {
            measures = ["temporature", "utilisation", "speed"]; // TODO: better way of setting/getting all, as adding anew measure will means a code change here as well.
        }

        return measures;
    }

    static defaultAggregates(aggregates = []) {
        if (!Array.isArray(aggregates)) aggregates = [aggregates];

        if (aggregates[0] === "all" || !aggregates.length) {
            aggregates = ["min", "max", "avg", "delta"];
        }

        return aggregates;
    }

    static defaultInstances(instances = []) {
        if (!Array.isArray(instances)) instances = [instances];

        if (!instances.length) {
            instances = ["all"]; // we dont know how many instances we have atm.
        }

        return instances;
    }
}

module.exports = HwWatcher;
