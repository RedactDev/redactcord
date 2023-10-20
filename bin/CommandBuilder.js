class CommandBuilder {

    static createBuilder(commandName) {
        return new CommandBuilder(commandName);
    }

    constructor(name) {
        this.name = name;
        this.args = [];
        this.options = [];
        this.description = "";
        this.callback = () => {};
    }

    setName(name) {
        this.name = name;
        return this;
    }

    setArguments(args) {
        this.args = args;
        return this;
    }

    addArgument(arg) {
        this.args.push(arg);
        return this;
    }

    addOption(opt) {
        this.options.push(opt);
        return this;
    }

    setOptions(opts) {
        this.options = opts;
        return this;
    }

    setDescription(description) {
        this.description = description;
        return this;
    }

    setCallback(callback) {
        this.callback = callback;
        return this;
    }

    toJSON() {
        return {
            name: this.name,
            args: this.args,
            description: this.description,
            options: this.options,
            callback: this.callback
        };
    }
}

module.exports = CommandBuilder;