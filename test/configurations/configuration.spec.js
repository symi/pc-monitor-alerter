let Configuration = require("../../src/configurations/configuration");
const {
        setMock,
        removeMock
    } = require("../mocks-helpers/GetAndInstantiateMock"),
    Scheduler = require("../../src/scheduler"),
    { expect } = require("chai"),
    fse = require("fs-extra"),
    path = require("path"),
    moment = require("moment");

function checkScheduler(scheduler) {
    let baseScheduler = new Scheduler();

    expect(scheduler).to.be.an.instanceOf(Scheduler);
    expect(scheduler.interval).to.equal(baseScheduler.interval);
    expect(scheduler.time.isSame(baseScheduler.time)).to.be.true;
}

function testSourceList(actualSources, expectedSources) {
    expect(actualSources).to.have.lengthOf(expectedSources.length);

    expectedSources.forEach((sourceString, index) => {
        expect(
            actualSources[index].spy.calledWithMatch(new RegExp(sourceString))
        ).to.be.true;
    });
}

function testScheduler(actualScheduler, expectedInterval, expectedTime) {
    expect(actualScheduler.interval).to.equal(expectedInterval);
    expect(
        actualScheduler.time.isSame(expectedTime, "seconds"),
        `expect ${actualScheduler.time.toISOString()} to be the same time as ${expectedTime.toISOString()}` // limiting granularity to 1 sec as ms can be different.
    ).to.be.true;
}

describe("Configuration, when created", () => {
    beforeEach(function() {
        // reset example as test mutate the object for their setup, cant use require because require.cache
        this.example = fse.readJSONSync(
            path.resolve(__dirname, "../../config/config.example.json")
        ); // this isnt at all slow... every test.

        this.spys = [];
        Configuration = setMock(
            (...args) => {
                let spy = this.sandbox.spy();
                this.spys.push(spy);
                spy(...args);

                return {
                    name: args[0], // stub out the basic name prop
                    spy
                };
            },
            require.resolve("../../src/watchers/watcher-factory"),
            require.resolve("../../src/configurations/configuration")
        )[1];
    });

    afterEach(() => {
        removeMock();
        delete this.spys;
    });

    describe("the default scheduler", () => {
        it("should create the base scheduler if default scheduler module is missing", function() {
            delete this.example.scheduler;

            let c = new Configuration(this.example);
            checkScheduler(c.defaultScheduler);
        });

        it("should create the base scheduler if default scheduler module has no time and interval", function() {
            this.example.scheduler = {};

            let c = new Configuration(this.example);
            checkScheduler(c.defaultScheduler);
        });

        it("should create a default scheduler from the config when present", function() {
            let c = new Configuration(this.example);

            expect(c.defaultScheduler.interval).to.equal(2);
            expect(
                c.defaultScheduler.time.isSame(
                    moment({
                        hours: 15,
                        minutes: 30,
                        seconds: 1
                    })
                )
            ).to.be.true;
        });
    });

    describe("the default sources", () => {
        it("a source class should be created for each source with the config array ordering honoured", function() {
            let c = new Configuration(this.example),
                sources = [
                    "open-hw-mon-wmi",
                    "sys-info",
                    "os",
                    "avira-wmi",
                    "diskusage",
                    "win-event"
                ];

            expect(c.defaultSources).to.have.lengthOf(sources.length);

            // checks each source spy was called in order with the correct source config name
            sources.forEach((sourceString, index) => {
                expect(
                    c.defaultSources[index].spy.calledWithMatch(
                        new RegExp(sourceString)
                    )
                ).to.be.true;
            });
        });
    });

    describe("the runners should be created", () => {
        it("with a runner class for each hw watcher", function() {
            delete this.example.swWatchers;

            let c = new Configuration(this.example),
                hwWatchers = ["cpu", "gpu", "gpu", "gpu-memory", "ram", "disk"];

            expect(c.runners).to.have.lengthOf(hwWatchers.length);

            hwWatchers.forEach((watcherString, index) => {
                expect(
                    c.runners[index].watcher.item.spy.calledWithMatch(
                        new RegExp(watcherString)
                    )
                ).to.be.true;
            });
        });

        it("with a runner class for each sw watcher", function() {
            delete this.example.hwWatchers;

            let c = new Configuration(this.example),
                swWatchers = [
                    "sys-log",
                    "sys-up-time",
                    "antivirus-avira",
                    "sys-info"
                ];

            expect(c.runners).to.have.lengthOf(swWatchers.length);

            swWatchers.forEach((watcherString, index) => {
                expect(
                    c.runners[index].watcher.item.spy.calledWithMatch(
                        new RegExp(watcherString)
                    )
                ).to.be.true;
            });
        });

        describe("and the source list calculated", () => {
            it("to the default source list when no watcher sources are present", function() {
                let c = new Configuration(this.example);

                testSourceList(c.runners[0].sources, [
                    "open-hw-mon-wmi",
                    "sys-info",
                    "os",
                    "avira-wmi",
                    "diskusage",
                    "win-event"
                ]);
            });

            it("to the watcher source list only when no default sources are present", function() {
                this.example.sources = [];
                this.example.hwWatchers = [this.example.hwWatchers[2]];
                this.example.swWatchers = [];

                let c = new Configuration(this.example);
                testSourceList(c.runners[0].sources, [
                    "sys-info",
                    "open-hw-mon-wmi"
                ]);
            });

            it("to the watcher source list then default source list, when both are present, with duplicates removed", function() {
                this.example.hwWatchers = [this.example.hwWatchers[2]];
                this.example.swWatchers = [];

                let c = new Configuration(this.example);

                testSourceList(c.runners[0].sources, [
                    "sys-info",
                    "open-hw-mon-wmi",
                    "os",
                    "avira-wmi",
                    "diskusage",
                    "win-event"
                ]);
            });

            it("but throws when the watcher and default source list is empty", function() {
                this.example.sources = [];
                expect(_ => new Configuration(this.example)).to.throw(
                    "Must either be a specified source for the watcher or a default source"
                );
            });
        });

        describe("and the scheduler calculated", () => {
            it("to the default scheduler if not watcher scheduler is present", function() {
                let c = new Configuration(this.example);
                testScheduler(
                    c.runners[3].scheduler,
                    2,
                    moment({ hours: 15, minutes: 30, seconds: 1 })
                );
            });

            it("to the watcher scheduler if present regardless of default scheduler", function() {
                // check only time, only interval in watcher scheduler with/without default
                let c = new Configuration(this.example);
                testScheduler(
                    c.runners[0].scheduler,
                    86400,
                    moment({ hours: 12, minutes: 0, seconds: 0 })
                );
                testScheduler(c.runners[1].scheduler, 5, moment());
            });
        });
    });
});
