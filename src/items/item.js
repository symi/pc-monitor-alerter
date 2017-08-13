const caller = require("caller"),
    { basename } = require("path");

class Item {
    constructor() {
        this._name = basename(caller(), ".js") || "UNKNOWN ITEM";
    }

    get name() {
        return this._name;
    }
}

module.exports = Item;
