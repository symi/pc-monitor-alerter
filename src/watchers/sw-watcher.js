const Watcher = require("./watcher");

class SwWatcher extends Watcher {
    constructor(item, measureConfiguration) {
        super(item, measureConfiguration);
    }

    static defaultAggregates(aggregates = []) {
        if (!Array.isArray(aggregates)) aggregates = [aggregates];

        if (aggregates[0] === "all" || !aggregates.length) {
            aggregates = ["count", "delta", "detail", "last"];
        }

        return aggregates;
    }
}

module.exports = SwWatcher;
