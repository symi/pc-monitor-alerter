const ConfigEntity = require("../config-entity");

class Source extends ConfigEntity {
    constructor(name) {
        super(name);
    }

    // The default for a source is not enabled, enforce descendants to implement.
    async available() {
        return false;
    }

    async getInstances(item, instances) {
        return [];
    }

    async getData(item) {}
}

module.exports = Source;
