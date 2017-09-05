const Item = require("./item");

class CPU extends Item {
    constructor(identifier, measureConfiguration) {
        super(identifier, measureConfiguration, "cpu");
    }
}

module.exports = CPU;
