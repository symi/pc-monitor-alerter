// Generated automatically by nearley
// http://github.com/Hardmath123/nearley
(function () {
function id(x) {return x[0]; }
 
    function nuller() { 
        return null; 
    } 

    function createNodeByIdValue(NodeType) { 
        return ([id]) => {
            return new NodeType(id.value);
        }        
    }


const moo = require("moo"),
    tokens = require("./tokens"),
    lexer = moo.compile(tokens),
    ast = require("./ast");

var grammar = {
    Lexer: lexer,
    ParserRules: [
    {"name": "MAIN$ebnf$1", "symbols": [(lexer.has("punctuation") ? {type: "punctuation"} : punctuation)], "postprocess": id},
    {"name": "MAIN$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "MAIN", "symbols": ["_", "RULE", "_", "MAIN$ebnf$1", "_"], "postprocess": ([, exp]) => exp},
    {"name": "RULE", "symbols": ["EXPRESSION", "_", "OPERATOR", "_", "VALUE"], "postprocess": ([expression,, operator,, value]) => new ast.RuleNode({expression, operator, value})},
    {"name": "EXPRESSION$ebnf$1", "symbols": ["AGGREGATE"], "postprocess": id},
    {"name": "EXPRESSION$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "EXPRESSION$ebnf$2", "symbols": ["INSTANCE"], "postprocess": id},
    {"name": "EXPRESSION$ebnf$2", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "EXPRESSION", "symbols": ["EXPRESSION$ebnf$1", "MEASURE", "SENSOR", "EXPRESSION$ebnf$2"], "postprocess": ([aggregate, measure, sensor, instance]) => new ast.ExpressionNode({aggregate, measure, record: sensor, instance})},
    {"name": "AGGREGATE", "symbols": [(lexer.has("aggregate") ? {type: "aggregate"} : aggregate), "__"], "postprocess": createNodeByIdValue(ast.TextNode)},
    {"name": "MEASURE", "symbols": [(lexer.has("measure") ? {type: "measure"} : measure)], "postprocess": createNodeByIdValue(ast.TextNode)},
    {"name": "SENSOR$subexpression$1", "symbols": [(lexer.has("quantifier") ? {type: "quantifier"} : quantifier), "__", (lexer.has("sensor") ? {type: "sensor"} : sensor)], "postprocess": createNodeByIdValue(ast.QuantifierNode)},
    {"name": "SENSOR$subexpression$1", "symbols": [(lexer.has("identifier") ? {type: "identifier"} : identifier)], "postprocess": createNodeByIdValue(ast.TextNode)},
    {"name": "SENSOR", "symbols": ["__", {"literal":"of"}, "__", "SENSOR$subexpression$1"], "postprocess": ([,,,sensor]) => sensor},
    {"name": "INSTANCE$subexpression$1", "symbols": [(lexer.has("quantifier") ? {type: "quantifier"} : quantifier), "__", (lexer.has("item") ? {type: "item"} : item)], "postprocess": createNodeByIdValue(ast.QuantifierNode)},
    {"name": "INSTANCE$subexpression$1", "symbols": [(lexer.has("item") ? {type: "item"} : item), "__", (lexer.has("nonzeronumber") ? {type: "nonzeronumber"} : nonzeronumber)], "postprocess": ([,,instance]) => new ast.NumberNode(instance.value)},
    {"name": "INSTANCE$subexpression$1", "symbols": [(lexer.has("identifier") ? {type: "identifier"} : identifier)], "postprocess": createNodeByIdValue(ast.TextNode)},
    {"name": "INSTANCE", "symbols": ["__", {"literal":"on"}, "__", "INSTANCE$subexpression$1"], "postprocess": ([,,,instance]) => instance},
    {"name": "OPERATOR", "symbols": [(lexer.has("operator") ? {type: "operator"} : operator)], "postprocess": createNodeByIdValue(ast.OperatorNode)},
    {"name": "VALUE", "symbols": [(lexer.has("number") ? {type: "number"} : number)], "postprocess": createNodeByIdValue(ast.NumberNode)},
    {"name": "VALUE", "symbols": [(lexer.has("nonzeronumber") ? {type: "nonzeronumber"} : nonzeronumber)], "postprocess": createNodeByIdValue(ast.NumberNode)},
    {"name": "_$ebnf$1", "symbols": [(lexer.has("WS") ? {type: "WS"} : WS)], "postprocess": id},
    {"name": "_$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "_", "symbols": ["_$ebnf$1"], "postprocess": nuller},
    {"name": "__", "symbols": [(lexer.has("WS") ? {type: "WS"} : WS)], "postprocess": nuller}
]
  , ParserStart: "MAIN"
}
if (typeof module !== 'undefined'&& typeof module.exports !== 'undefined') {
   module.exports = grammar;
} else {
   window.grammar = grammar;
}
})();
