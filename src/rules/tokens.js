module.exports = {
    identifier: {
        match: /(?:'|").+?(?:'|")/,
        value: x => x.replace(/("|')/g, "")
    },
    aggregate: ["min", "mean", "max", "delta", "sum"],
    measure: ["temperature", "utilisation", "speed"],
    item: /(?:cpu|gpu)s?/,
    sensor: /sensors?/,
    quantifier: ["any", "all"],
    operator: [
        ">", "greater than",
        "<", "less than",
        "<=", "less than or equal to",
        ">=", "greater than or equal to",
        "!=", "not equal to", "is not",
        "=", "equals", "equal to", "is"
    ],
    punctuation: [",", ".", ";"],
    nonzeronumber: /[0-9]*[1-9][0-9]*/,
    number: /[0-9]+/,
    word: /[\S]+/,
    WS: { match: /\s+/, lineBreaks: true }
};
