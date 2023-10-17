const { program } = require("commander");

function command(name, opts) {
    return program.command(name, opts);
}

module.exports = {
    command,
}