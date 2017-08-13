class Watcher {
    constructor(item, measures = [], aggregates = []) {
        this._item = item;
        this._measures = measures;
        this._aggregates = aggregates;
    }

    get item() {
        return this._item;
    }

    get measures() {
        return this._measures;
    }

    get aggregates() {
        return this._aggregates;
    }
}

module.exports = Watcher;
