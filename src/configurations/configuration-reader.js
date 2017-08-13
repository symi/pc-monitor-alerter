const fse = require("fs-extra");

class ConfigurationReader {
    constructor(path) {
        this._path = path;

        if (!fse.pathExistsSync(this._path)) {
            throw new Error(`No configuration file at "${this._path}"`);
        }
    }

    async read() {
        return await fse.readJson(this._path);
    }
}

module.exports = ConfigurationReader;
