class Runner {
    constructor(watcher, sources, scheduler, reporterConfigurations) {
        this._watcher = watcher;
        this._sources = sources;
        this._scheduler = scheduler;
        this._reporterConfigurations = reporterConfigurations;

        // register our run handler, even tho its an async handler it doesnt matter.
        this.scheduler.on("run", this.execute.bind(this));
    }

    get watcher() {
        return this._watcher;
    }

    get sources() {
        return this._sources;
    }

    get scheduler() {
        return this._scheduler;
    }

    get reporterConfigurations() {
        return this._reporterConfigurations;
    }

    async execute() {
        try {
            // see which sources are current available and only pass them to the watcher.
            // again we dont care getData is async. TODO: are we sure we dont care???
            await /* <-- TODO: remove */ this.watcher.getData(
                await Runner._getAvailableSources(this.sources)
            );

            this.reporterConfigurations.forEach(reporterConfiguration => {
                if (reporterConfiguration.rule.test(this.watcher))
                    reporterConfiguration.reporter.report(this.watcher); // this is probably async
            });
        } catch (err) {
            console.error(err); // TODO: better error handling... async func so this even require its going to knock out the whole runner loop.
        }
    }

    start() {
        this.scheduler.start();
    }

    stop() {
        this.scheduler.stop();
    }

    static async _getAvailableSources(sources) {
        // kick off the available calls in parallel, but keep overall source ordering.
        sources = await Promise.all(
            sources.map(async source => {
                return (await source.available()) ? source : undefined;
            })
        );

        return sources.filter(source => source !== undefined);
    }
}

module.exports = Runner;
