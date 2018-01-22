const Reporter = require("./reporter"),
    chalk = require("chalk");

class ConsoleBasic extends Reporter {
    constructor() {
        super();
    }

    report(watcher) {
        console.log(
            "\n\n" + chalk.gray("======================================") + "\n"
        );

        if (!watcher.items.length) {
            console.log(`${chalk.underline.redBright(watcher.itemName.toUpperCase())} - ${chalk.underline.redBright("NO-ITEM-DATA")}`);
        }

        watcher.items.forEach(item => {
            console.log(
                `${watcher.itemName} ${chalk.gray(
                    "("
                ) + item.identifier + chalk.gray(")")}`
            );
            item.measures.forEach(measure => {
                console.log(`  ${measure.name}`);

                if (!measure.records) {
                    console.log(
                        `\t${chalk.underline.redBright("NO-RECORD-DATA")}`
                    );
                    return;
                }

                const unit = measure.unit;

                for (let record of measure.records) {
                    // TODO: have under, near and over states, triggering on record and aggregate, boundaries in config
                    let formatter = record.failure ? chalk.bold.redBright : chalk.bold.blueBright;
                    let val = formatter(`${record.value}${unit}`);

                    let aggVals = record.aggregates
                        .reduce((output, aggregate) => {
                            formatter = aggregate.failure ? chalk.redBright : chalk.blueBright;
                            let aggVal = formatter(`${aggregate.value}${unit}`);

                            output.push(
                                chalk.gray("(") +
                                    aggregate.name +
                                    " " +
                                    aggVal +
                                    chalk.gray(")")
                            );
                            return output;
                        }, [])
                        .join(' ');

                    console.log(
                        `\t${chalk.bold(record.name)}\t${val}\t${aggVals}`
                    );
                }
            });
        });
    }
}

module.exports = ConsoleBasic;
