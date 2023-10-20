const { Collection } = require("discord.js");

function RegisterCommand(program, data) {

    const { name, args, description, options, callback } = data;
    

    if (!description) {
        
    }

    if (!callback) {
        
    }

    let l = program.command(name)
        .description(description)
        .action(callback);
    
    if (args && args.length) {
        for (const arg of args) {
            l.argument(arg);
        }
    }

    if (options && options.length) {
        for (const option of options) {
            l.option(option);
        }
    }
}

function RegisterJSONCommand(program, builder) {
    RegisterCommand(program, builder.toJSON());
}

module.exports = {
    RegisterCommand,
    RegisterJSONCommand
}