const { RegisterCommand, RegisterJSONCommand } = require("../CommandsHandler");
const InitCommand = require("./InitCommand");
const RunCommand = require("./RunCommand");
const VersionCommand = require("./VersionCommand");
const WatchCommand = require("./WatchCommand");

module.exports = (program) => {
    RegisterJSONCommand(program, VersionCommand());
    RegisterJSONCommand(program, InitCommand());
    RegisterJSONCommand(program, RunCommand());
    RegisterJSONCommand(program, WatchCommand());
}