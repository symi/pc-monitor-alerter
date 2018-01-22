const Item = require("./item");

class GPU extends Item {
    constructor(identifier, measureConfiguration) {
        super(identifier, measureConfiguration, "gpu");
    }
}

module.exports = GPU;