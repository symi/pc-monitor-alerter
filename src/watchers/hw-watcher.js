const Watcher = require("./watcher");

class HwWatcher extends Watcher {
    constructor(item, measures, aggregates, instances = ["all"]) {
        super(item, measures, aggregates);
        this._instances = instances;
    }

    get instances() {
        return this._instances;
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
