const ConfigEntity = require("../config-entity"),
    { GetAndInstantiateMixin } = require("../mixins");

class Item extends GetAndInstantiateMixin(ConfigEntity) {
    constructor(identifier, measureConfiguration, name) {
        super(name);
        this._measures = Item._getMeasures(measureConfiguration);
        this._identifier = identifier;
    }

    get measures() {
        return this._measures;
    }

    get identifier() {
        return this._identifier;
    }

    static _getMeasures(measureConfiguration) {
        return measureConfiguration.measureNames.map(measure =>
            Item._getAndInstantiate(
                `../measures/${measure}`,
                measureConfiguration.historyCount,
                measureConfiguration.aggregates
            )
        );
    }

    /**
     * 
     * @return {boolean} Whether all the item's measures' records are populated with values.
     * @readonly
     * @memberof Item
     */
    get populated() {
        return this.measures.every(
            measure =>
                measure.records &&
                measure.records.every(record => record.value != null)
        );
    }
}

module.exports = Item;
