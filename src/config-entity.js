const caller = require("caller"),
    { basename } = require("path");

class ConfigEntity {
    constructor(name) {
        this._name = name || basename(caller(2), ".js") || "UNKNOWN Entity";
    }

    get name() {
        return this._name;
    }
}

module.exports = ConfigEntity;
