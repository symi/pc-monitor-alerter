const { GetAndInstantiateMixin } = require("../mixins");

class Watcher extends GetAndInstantiateMixin() {
    constructor(itemName, measures, aggregates = []) {
        super();
        this._itemName = itemName;
        this._aggregates = aggregates;
        this._measures = measures;
        this._items = [];
    }

    get itemName() {
        return this._itemName;
    }

    get items() {
        return this._items;
    }

    set items(itemConfigurations) {
        this._items = itemConfigurations.map(itemConfiguration =>
            Watcher._getAndInstantiate(
                `../items/${itemConfiguration.name}`,
                this._measures,
                itemConfiguration.identifier
            )
        );
    }

    get aggregates() {
        return this._aggregates;
    }

    getData(sources) {
        return undefined; // enforce derived classes implement.
    }
}

module.exports = Watcher;
