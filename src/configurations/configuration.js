const moment = require("moment"),
    Scheduler = require("../scheduler"),
    WatcherFactory = require("../watchers/watcher-factory"),
    Runner = require("../runner"),
    { GetAndInstantiateMixin } = require("../mixins");

class Configuration extends GetAndInstantiateMixin() {
    constructor(config) {
        super();
        this._defaultScheduler = this._getScheduler(config.scheduler, true);
        this._defaultSources = this._getSources(config.sources, true);
        this._runners = this._getHwRunners(config.hwWatchers).concat(
            this._getSwRunners(config.swWatchers)
        );

        this._defaultHistoryCount = config.historyCount;
    }

    get defaultScheduler() {
        return this._defaultScheduler;
    }

    get defaultSources() {
        return this._defaultSources;
    }

    get runners() {
        return this._runners;
    }

    _getScheduler(config, isDefault = false) {
        let scheduler;

        if (config || isDefault) {
            scheduler = new Scheduler(config);
        } else {
            scheduler = this.defaultScheduler;
        }

        return scheduler;
    }

    _getSources(config = [], isDefault = false) {
        let sources;

        if (!Array.isArray(config)) config = [config];

        if (!isDefault && !config.length) {
            // skip check for default since config and default source can be empty during generation.
            if (!this.defaultSources.length)
                throw new Error(
                    "Must either be a specified source for the watcher or a default source"
                );

            sources = this.defaultSources;
        } else {
            sources = config
                .map(source => {
                    return Configuration._getAndInstantiate(
                        `../sources/${source}`
                    );
                })
                .filter(source => source != null); // TODO: Keep? change _getAndInstantiate to error when invalid?

            if (
                Array.isArray(this.defaultSources) &&
                this.defaultSources.length
            ) {
                let uniqueSources = new Set();
                sources = sources.concat(this.defaultSources).filter(source => {
                    let k = source.name;
                    return uniqueSources.has(k) ? false : uniqueSources.add(k);
                });
            }
        }

        return sources;
    }

    /**
     * Gets the history count property for each watcher. If no historyCount prop is present
     * on the watcher config node, then the default historyCount prop is used.
     * 
     * @private
     * @param {number} count The count of the watcher node.
     * @returns {number} The resolved count.
     * @memberof Configuration
     */
    _getHistoryCount(count) {
        if (count != null) return count;

        return this._defaultHistoryCount;
    }

    _getHwRunners(config = []) {
        return Array.from(config).map(watcherConfig => {
            let watcher = WatcherFactory.createHwWatcher(
                    watcherConfig.item,
                    watcherConfig.measures,
                    this._getHistoryCount(watcherConfig.historyCount),
                    watcherConfig.aggregates,
                    watcherConfig.instances
                ),
                sources = this._getSources(watcherConfig.sources),
                scheduler = this._getScheduler(watcherConfig.scheduler);

            return new Runner(watcher, sources, scheduler);
        });
    }

    _getSwRunners(config = []) {
        return Array.from(config).map(watcherConfig => {
            let watcher = WatcherFactory.createSwWatcher(
                    watcherConfig.item,
                    watcherConfig.measures,
                    this._getHistoryCount(watcherConfig.historyCount),
                    watcherConfig.aggregates
                ),
                sources = this._getSources(watcherConfig.sources),
                scheduler = this._getScheduler(watcherConfig.scheduler);

            return new Runner(watcher, sources, scheduler);
        });
    }
}

module.exports = Configuration;
