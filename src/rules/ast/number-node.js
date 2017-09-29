const Node = require("./node");

class NumberNode extends Node {
    constructor(value) {
        super(parseInt(value, 10));
    }
}

module.exports = NumberNode;