const Item = require("./item");

class CPU extends Item {
    constructor(measures, identifier) {
        super("cpu", measures, identifier);
    }
}

module.exports = CPU;
