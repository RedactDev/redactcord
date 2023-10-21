#!/usr/bin/env node

const { program } = require("commander");
const { getCommands, ExecuteCommand } = require("./CommandsHandler");
const RegisterCommands = require("./commands/RegisterCommands");

async function init() {
    await RegisterCommands(program);


}

function run() {
    program.parse();
}

init().then(_ => {
    run();
})