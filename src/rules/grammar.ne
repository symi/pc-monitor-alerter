# A Grammer for parsing reporter rules from configuration constructed using the nearley parser,
# and moo lexer/tokenizer.
# Grammer/tokens are case aware and only deal with lower case, so all parsed strings need a .lowerCase() call.

@{%
    function nuller() {
        return null;
    }

    function createNodeByIdValue(NodeType) {
        return ([id]) => {
            return new NodeType(id.value);
        }
    }
%}

# lexer setup
@{%
const moo = require("moo"),
    tokens = require("./tokens"),
    lexer = moo.compile(tokens),
    ast = require("./ast");

%}

@lexer lexer

MAIN ->
    _ RULE _ %punctuation:? _               {% ([, exp]) => exp %}

RULE ->
    EXPRESSION _ OPERATOR _ VALUE           {% ([expression,, operator,, value]) => new ast.RuleNode({expression, operator, value}) %}

EXPRESSION ->
    AGGREGATE:? MEASURE SENSOR INSTANCE:?   {% ([aggregate, measure, sensor, instance]) => new ast.ExpressionNode({aggregate, measure, record: sensor, instance}) %}

AGGREGATE ->
    %aggregate __                           {% createNodeByIdValue(ast.TextNode) %}

MEASURE ->
    %measure                                {% createNodeByIdValue(ast.TextNode) %}

SENSOR ->
    __ "of" __ (
        %quantifier __ %sensor              {% createNodeByIdValue(ast.QuantifierNode) %}
        | %identifier                       {% createNodeByIdValue(ast.TextNode) %}
    )                                       {% ([,,,sensor]) => sensor %}

INSTANCE ->
    __ "on" __ (
        %quantifier __ %item                {% createNodeByIdValue(ast.QuantifierNode) %}
        | %item __ %nonzeronumber           {% ([,,instance]) => new ast.NumberNode(instance.value) %}
        | %identifier                       {% createNodeByIdValue(ast.TextNode) %}
    )                                       {% ([,,,instance]) => instance %}

OPERATOR ->
    %operator                               {% createNodeByIdValue(ast.OperatorNode) %}

VALUE ->
    %number                                 {% createNodeByIdValue(ast.NumberNode) %}
    | %nonzeronumber                        {% createNodeByIdValue(ast.NumberNode) %}


# optional whitespace
_ ->
    %WS:?                                   {% nuller %}

# required whitespace
__ ->
    %WS                                     {% nuller %}