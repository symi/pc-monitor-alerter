const Item = require("./item");

class Disk extends Item {
    constructor(identifier, measureConfiguration) {
        super(identifier, measureConfiguration, "disk");
    }
}

module.exports = Disk;
