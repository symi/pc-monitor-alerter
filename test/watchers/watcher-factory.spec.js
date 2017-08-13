let WatcherFactory = require("../../src/watchers/watcher-factory");
const { expect } = require("chai"),
    Watcher = require("../../src/watchers/watcher"),
    HwWatcher = require("../../src/watchers/hw-watcher"),
    SwWatcher = require("../../src/watchers/sw-watcher"),
    { setMock, removeMock } = require("../mocks-helpers/GetAndInstantiateMock");

describe("WatcherFactory", () => {
    beforeEach(function() {
        this.spys = [];
        WatcherFactory = setMock((...args) => {
            let spy = this.sandbox.spy();
            this.spys.push(spy);
            spy(...args);

            return {
                spy
            };
        }, require.resolve("../../src/watchers/watcher-factory"))[0];
    });

    afterEach(() => {
        removeMock();
        delete this.spys;
    });

    function checkBase(watcher, item, measures, ags) {
        expect(watcher).to.be.an.instanceOf(Watcher);
        expect(watcher.item.spy.calledWithMatch(new RegExp(item))).to.be.true;
        measures.forEach((measure, index) => {
            expect(
                watcher.measures[index].spy.calledWithMatch(new RegExp(measure))
            ).to.be.true;
        });
        ags.forEach((ag, index) => {
            expect(
                watcher.aggregates[index].spy.calledWithMatch(new RegExp(ag))
            ).to.be.true;
        });
    }

    it("should create the base Watcher from identifiers", () => {
        let watcher = WatcherFactory.createWatcher(
            "item1",
            ["measure1", "measure2"],
            ["ag1", "ag2"]
        );

        checkBase(watcher, "item1", ["measure1", "measure2"], ["ag1", "ag2"]);
    });

    it("should create a hw watcher from identifiers", () => {
        let watcher = WatcherFactory.createHwWatcher(
            "item1",
            ["measure1", "measure2"],
            ["ag1", "ag2"],
            [1]
        );

        expect(watcher).to.be.an.instanceOf(HwWatcher);
        checkBase(watcher, "item1", ["measure1", "measure2"], ["ag1", "ag2"]);
        expect(watcher.instances[0]).to.equal(1);
    });

    it("should create a sw watcher from identifiers", () => {
        let watcher = WatcherFactory.createSwWatcher(
            "item1",
            ["measure1", "measure2"],
            ["ag1", "ag2"]
        );

        expect(watcher).to.be.an.instanceOf(SwWatcher);
        checkBase(watcher, "item1", ["measure1", "measure2"], ["ag1", "ag2"]);
    });
});
