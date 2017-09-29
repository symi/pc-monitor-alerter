const Node = require("./node"),
    TextNode = require("./text-node"),
    QuantifierNode = require("./quantifier-node");

class ExpressionNode extends Node {
    constructor(value) {
        super(value);

        this.aggregate = value.aggregate || new TextNode();
        this.measure = value.measure;
        this.record = value.record;
        this.instance = value.instance || new QuantifierNode("any");
    }
}

module.exports = ExpressionNode;
