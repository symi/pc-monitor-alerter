const ConfigurationReader = require("./configuration-reader");
const Configuration = require("./configuration");

class ConfigurationBuilder {
    constructor(path) {
        this._path = path;
        this._reader = new ConfigurationReader(this._path);
    }

    async getConfiguration() {
        let configJSON = await this._reader.read();
        return new Configuration(configJSON);
    }
}

module.exports = ConfigurationBuilder;
