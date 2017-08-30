const ConfigEntity = require("../config-entity");

class Measure extends ConfigEntity {
    constructor(unitString) {
        super();
        this._records = [];
        this._unit = unitString;
    }

    get records() {
        return this._records;
    }

    set records(records) {
        this._records = records;
    }

    get unit() {
        return this._unit;
    }
}

module.exports = Measure;
