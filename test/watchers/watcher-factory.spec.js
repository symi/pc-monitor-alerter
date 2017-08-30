let WatcherFactory = require("../../src/watchers/watcher-factory"),
    Watcher = require("../../src/watchers/watcher"),
    HwWatcher = require("../../src/watchers/hw-watcher"),
    SwWatcher = require("../../src/watchers/sw-watcher");

const { expect } = require("chai"),
    { setMock, removeMock } = require("../mocks-helpers/GetAndInstantiateMock");

describe("WatcherFactory", () => {
    beforeEach(function() {
        this.spys = [];
        [Watcher, HwWatcher, SwWatcher, WatcherFactory] = setMock(
            (...args) => {
                let spy = this.sandbox.spy();
                this.spys.push(spy);
                spy(...args);

                return {
                    spy
                };
            },
            require.resolve("../../src/watchers/watcher"),
            require.resolve("../../src/watchers/hw-watcher"),
            require.resolve("../../src/watchers/sw-watcher"),
            require.resolve("../../src/watchers/watcher-factory")
        );
    });

    afterEach(() => {
        removeMock();
        delete this.spys;
    });

    function checkBase(watcher, item, measures, ags) {
        expect(watcher).to.be.an.instanceOf(Watcher);
        expect(watcher.itemName).to.equal(item);

        // set dummy item instance to check measures set.
        watcher.items = [{ name: "test", identifier: "test" }];
        expect(watcher.items[0].spy.getCall(0).args[1]).to.have.members(
            measures
        );

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
