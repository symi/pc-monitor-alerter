const ConfigEntity = require("../config-entity"),
    { GetAndInstantiateMixin } = require("../mixins");

class Item extends GetAndInstantiateMixin(ConfigEntity) {
    constructor(name, measures, identifier) {
        super(name);
        this._measures = Item._getMeasures(measures);
        this._identifier = identifier;
    }

    get measures() {
        return this._measures;
    }

    get identifier() {
        return this._identifier;
    }

    static _getMeasures(measures = []) {
        return measures.map(measure =>
            Item._getAndInstantiate(`../measures/${measure}`)
        );
    }

    get populated() {
        // TODO use measures..records
        return this._measures.every(measure => measure.value !== undefined);
    }
}

module.exports = Item;
