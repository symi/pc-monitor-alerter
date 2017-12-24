const Reporter = require('./reporter');
const { consoleApp: { path, filename } } = require('../../package.json');
const { resolve } = require('path');


class Console extends Reporter {
  constructor() {
      super();
      this.app = require(resolve(__dirname, '../../', path, filename));
  }

  report(watcher) {
    console.log(this.app);
    // for (let record of watcher.items[0].measures[0].records) {
    //   if (record.name === 'Package') {
    //     App.update(record.value);
    //   }
    // }
  }
}

module.exports = Console;
