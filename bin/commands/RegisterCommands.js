const { RegisterCommand, RegisterJSONCommand } = require("../CommandsHandler");
const InitCommand = require("./InitCommand");
const RunCommand = require("./RunCommand");
const VersionCommand = require("./VersionCommand");

module.exports = (program) => {
    RegisterJSONCommand(program, VersionCommand());
    RegisterJSONCommand(program, InitCommand());
    RegisterJSONCommand(program, RunCommand());
}