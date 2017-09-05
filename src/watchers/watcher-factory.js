const Watcher = require("./watcher"),
    HwWatcher = require("./hw-watcher"),
    SwWatcher = require("./sw-watcher"),
    MeasureConfiguration = require("../measures/measure-configuration");

class WatcherFactory {
    static createWatcher(item, measures, historyCount, aggregates) {
        return new Watcher(
            ...WatcherFactory._getBaseArgs(
                item,
                measures,
                historyCount,
                aggregates
            )
        );
    }

    static createHwWatcher(
        item,
        measures,
        historyCount,
        aggregates,
        instances
    ) {
        return new HwWatcher(
            ...WatcherFactory._getBaseArgs(
                item,
                HwWatcher.defaultMeasures(measures),
                historyCount,
                HwWatcher.defaultAggregates(aggregates)
            ),
            HwWatcher.defaultInstances(instances)
        );
    }

    static createSwWatcher(item, measures, historyCount, aggregates) {
        return new SwWatcher(
            ...WatcherFactory._getBaseArgs(
                item,
                measures,
                historyCount,
                SwWatcher.defaultAggregates(aggregates)
            )
        );
    }

    static _getBaseArgs(item, measures, historyCount, aggregates) {
        return [
            item,
            new MeasureConfiguration(
                measures,
                historyCount,
                aggregates
            )
        ];
    }
}

module.exports = WatcherFactory;
