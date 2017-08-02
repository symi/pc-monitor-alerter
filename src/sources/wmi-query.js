const { promisify } = require("util");
const wmiQuery = promisify(require("node-wmi").Query);
const PSCommand = require("./ps-command");

export default class WMIQuery extends PSCommand {
    constructor(namespace, className) {
        this._PSCommand = "Get-WmiObject";
        this._namespace = this._validateNamespace(namespace);
        this.className = className;
    }

    get namespace() {
        return this._namespace;
    }

    get className() {
        return this._className;
    }

    set className(className) {
        this._className = this._validateClassName(className);
    }

    _validateClassName(className) {
        if (!className instanceof String) {
            throw new Error(
                `className must be of type string. Given type "${typeof className}", value "${className}".`
            );
        }

        return className;
    }

    _validateNamespace(namespace) {
        if (!namespace instanceof String) {
            throw new Error(
                `namespace must be of type string. Given type "${typeof namespace}", value "${namespace}".`
            );
        }

        return namespace.replace(/\\/g, "\\\\");
    }

    async _execNodeWMI(fields) {
        let query = { namespace: this.namespace, class: this.className};

        if (fields.length) {
            query.properties = fields;
        }

        return await wmiQuery(query);
    }

    async _execPSWMI(fields) {
        let selectCommand = "";

        if (fields.length) {
            selectCommand = ` | Select-Object ${fields.join(",")}`;
        }

        return await this.exec(selectCommand);
    }

    async exec(commandString, toJson = true) {
        return await super.exec(
            `${this._PSCommand} -namespace ${this.namespace} -class ${this
                .className} ${commandString}`,
            toJson
        );
    }

    async query(fields = [], typeTransformation = true) {
        let data;

        if (typeTransformation) {
            data = await this._execNodeWMI(fields);
        } else {
            data = await this._execPSWMI(fields);
        }

        return data;
    }
}
