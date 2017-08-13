const caller = require("caller"),
    { basename } = require("path");

class Measure {
    constructor(value, unit) {
        this._name = basename(caller(), ".js") || "UNKNOWN measure";
        this._value = value;
        this._unit = unit;
    }

    get name() {
        return this._name;
    }

    get value() {
        return this._value;
    }

    set value(value) {
        this._value = value;
    }

    get unit() {
        return this._unit;
    }
}

module.exports = Measure;
