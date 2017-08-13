const Watcher = require("./watcher");

class SwWatcher extends Watcher {
    constructor(item, measures, aggregates) {
        super(
            item,
            measures, // no defaults for sw measures
            aggregates
        );
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
