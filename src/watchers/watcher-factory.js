const { GetAndInstantiateMixin } = require("../mixins"),
    Watcher = require("./watcher"),
    HwWatcher = require("./hw-watcher"),
    SwWatcher = require("./sw-watcher");

class WatcherFactory extends GetAndInstantiateMixin() {
    static createWatcher(item, measures, aggregates) {
        return new Watcher(
            ...WatcherFactory._getBaseArgs(item, measures, aggregates)
        );
    }

    static createHwWatcher(item, measures, aggregates, instances) {
        return new HwWatcher(
            ...WatcherFactory._getBaseArgs(
                `hw-items/${item}`,
                HwWatcher.defaultMeasures(measures),
                HwWatcher.defaultAggregates(aggregates)
            ),
            HwWatcher.defaultInstances(instances)
        );
    }

    static createSwWatcher(item, measures, aggregates) {
        return new SwWatcher(
            ...WatcherFactory._getBaseArgs(
                `sw-items/${item}`,
                measures,
                SwWatcher.defaultAggregates(aggregates)
            )
        );
    }

    static _getBaseArgs(item, measures = [], aggregates = []) {
        return [
            WatcherFactory._getAndInstantiate(`../items/${item}`),
            measures.map(measure =>
                WatcherFactory._getAndInstantiate(`../measures/${measure}`)
            ),
            aggregates.map(aggregate =>
                WatcherFactory._getAndInstantiate(`../aggregates/${aggregate}`)
            )
        ];
    }
}

module.exports = WatcherFactory;