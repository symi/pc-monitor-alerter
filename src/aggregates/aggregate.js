const caller = require("caller"),
    { basename } = require("path");

class Aggregate {
    constructor() {
        this._name = basename(caller(), ".js") || "UNKNOWN Aggregate";
    }

    get name() {
        return this._name;
    }
}

module.exports = Aggregate;
