const moment = require("moment"),
    { compact } = require("lodash"),
    Scheduler = require("../scheduler"),
    WatcherFactory = require("../watchers/watcher-factory"),
    Runner = require("../runner"),
    ReporterConfiguration = require("../reporters/reporter-configuration"),
    { GetAndInstantiateMixin } = require("../mixins");

class Configuration extends GetAndInstantiateMixin() {
    constructor(config) {
        super();
        this._defaultScheduler = this._getScheduler(config.scheduler, true);
        this._defaultSources = this._getSources(config.sources, true);
        this._defaultReporters = this._getReporters(config.reporters, true);
        this._runners = this._getHwRunners(config.hwWatchers).concat(
            this._getSwRunners(config.swWatchers)
        );

        this._defaultHistoryCount = config.historyCount;

        if (!this._runners.length) {
            throw new Error("No watchers configured to run, check config/config.json file.");
        }
    }

    get defaultScheduler() {
        return this._defaultScheduler;
    }

    get defaultSources() {
        return this._defaultSources;
    }

    get defaultReporters() {
        return this._defaultReporters;
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
     * Gets the reporters for a node, whether that be the default reporters for all watchers,
     * or the reporters for a watcher.
     *
     * Default reporters are added to the watcher reporters, to make the final list of reporters
     * for each watcher. Rules on watcher reporters override rules on default reporters.
     *
     * @param {object|Array<object>} [config=[]]
     * @param {boolean} [isDefault=false]
     * @returns {Array<object>|ARray<Reporter>} An array of configuration objects or an array of reporter objects.
     * @memberof Configuration
     */
    // TODO: the boolean isDefault flag sucks, it complicates args/return types and logic. split out into separate method.
    _getReporters(config = [], isDefault = false) {
        if (!Array.isArray(config)) config = [config];

        let reporters = config;

        if (!isDefault) {
            this._defaultReporters.forEach(defaultReporter => {
                if (
                    !config.find(
                        reporter => reporter.name === defaultReporter.name
                    )
                ) {
                    reporters.push(defaultReporter);
                }
            });

            reporters = reporters
                .map(reporter => {
                    return new ReporterConfiguration(
                        reporter.name,
                        reporter.rule
                    );
                });
        }

        return reporters;
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
        return compact(Array.from(config).map(watcherConfig => {
            if (watcherConfig.enabled === false) return;

            let watcher = WatcherFactory.createHwWatcher(
                    watcherConfig.item,
                    watcherConfig.measures,
                    this._getHistoryCount(watcherConfig.historyCount),
                    watcherConfig.aggregates,
                    watcherConfig.instances
                ),
                sources = this._getSources(watcherConfig.sources),
                scheduler = this._getScheduler(watcherConfig.scheduler),
                reporterConfigurations = this._getReporters(
                    watcherConfig.reporters
                );

            return new Runner(
                watcher,
                sources,
                scheduler,
                reporterConfigurations
            );
        }));
    }

    _getSwRunners(config = []) {
        return compact(Array.from(config).map(watcherConfig => {
            if (watcherConfig.enabled === false) return;

            let watcher = WatcherFactory.createSwWatcher(
                    watcherConfig.item,
                    watcherConfig.measures,
                    this._getHistoryCount(watcherConfig.historyCount),
                    watcherConfig.aggregates
                ),
                sources = this._getSources(watcherConfig.sources),
                scheduler = this._getScheduler(watcherConfig.scheduler),
                reporterConfigurations = this._getReporters(
                    watcherConfig.reporters
                );

            return new Runner(
                watcher,
                sources,
                scheduler,
                reporterConfigurations
            );
        }));
    }
}

module.exports = Configuration;
