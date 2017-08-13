const Watcher = require("../../src/watchers/watcher"),
    { expect } = require("chai"),
    Item = require("../../src/items/item"),
    Measure = require("../../src/measures/measure"),
    Aggregate = require("../../src/aggregates/aggregate");

describe("Watcher", () => {
    it("when instantiated with an item, measures and aggregates, should return those via its api", () => {
        const item = new Item(),
            measures = [new Measure(), new Measure()],
            aggregates = [new Aggregate(), new Aggregate()];

        let watcher = new Watcher(item, measures, aggregates);

        expect(watcher.item).to.equal(item);
        expect(watcher.measures).to.have.members(measures);
        expect(watcher.aggregates).to.have.members(aggregates);
    });

    it("when instantiated with no measures or aggregate should return an empty array for them via its api", () => {
        const item = new Item();

        let watcher = new Watcher(item);

        expect(watcher.item).to.equal(item);
        expect(watcher.measures).to.have.lengthOf(0);
        expect(watcher.aggregates).to.have.lengthOf(0);
    });
});
