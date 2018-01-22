// TODO: remove this file
const nearley = require("nearley"),
    grammar = require("./grammar");

const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));

let start = new Date();
//parser.feed("average temperature of all sensors on any cpu > 60.");
parser.feed("temperature of 'any core gpu # 1' = 50".toLowerCase());

let end = new Date();
let duration = end - start;
let result = parser.results[0];
console.log(JSON.stringify(result), duration);
