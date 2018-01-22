const Item = require("./item");

class GPUMemory extends Item {
    constructor(identifier, measureConfiguration) {
        super(identifier, measureConfiguration, "gpu-memory");
    }
}

module.exports = GPUMemory;
