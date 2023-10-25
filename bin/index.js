#!/usr/bin/env node

const { program } = require("commander");
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