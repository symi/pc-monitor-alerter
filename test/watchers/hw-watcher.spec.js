const HwWatcher = require("../../src/watchers/hw-watcher"),
    { expect } = require("chai"),
    Item = require("../../src/items/item"),
    Measure = require("../../src/measures/measure"),
    Aggregate = require("../../src/aggregates/aggregate");

describe("HwWatcher", () => {
    it("when instantiated with an item, measures, aggregates and instances array, should return them via its api", () => {
        const instances = [1, 2, 3];

        let watcher = new HwWatcher(new Item(), [], [], undefined, instances);

        expect(watcher.instances).to.have.members(instances);
    });

    it("when instantiated with no instances should return an all instance via its api", () => {
        let watcher = new HwWatcher(new Item(), [], [], undefined, undefined);

        expect(watcher.instances).to.have.members(["all"]);
    });

    function testDefaulters(entity, defaulterFn, defaultVals) {
        describe(`default${entity}s static method`, () => {
            it(`when called with no ${entity}s or empty array of ${entity}s should return all ${entity}s`, () => {
                expect(defaulterFn()).to.have.members(defaultVals);
                expect(defaulterFn([])).to.have.members(defaultVals);
            });

            it(`when called with "all" should return all ${entity}s`, () => {
                expect(defaulterFn("all")).to.have.members(defaultVals);
                expect(defaulterFn(["all"])).to.have.members(defaultVals);
            });
    
            it(`when called with a single ${entity} should return that ${entity} in an array`, () => {
                expect(defaulterFn(defaultVals[0])).to.have.members([defaultVals[0]]);
            });
    
            it(`when called with a ${entity}s array, should just return that array`, () => {
                expect(defaulterFn([defaultVals[0]])).to.have.members([defaultVals[0]]);
            });
        });
    }

    testDefaulters("measure", HwWatcher.defaultMeasures, ["temporature", "utilisation", "speed"]);
    testDefaulters("aggregate", HwWatcher.defaultAggregates, ["min", "max", "avg", "delta"]);
    testDefaulters("instance", HwWatcher.defaultInstances, ["all"]);
});
