const Item = require("./item");

class RAM extends Item {
    constructor(identifier, measureConfiguration) {
        super(identifier, measureConfiguration, "ram");
    }
}

module.exports = RAM;