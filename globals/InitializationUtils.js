const { writeFileSync, mkdirSync } = require("fs");
const path = require("path");

const configName = "redact.config.json";
const environmentName = ".redact.env";
const files = [
    environmentName,
    "src/index.js",
];
const directories = [
    "src",
    "commands",
    "events",
];

const packageConfig = {
    name: path.basename(path.dirname(process.cwd())),
    version: "1.0.0",
    description: "Generated Bot Project by Redactcord",
    main: "src/index.js",
    scripts: {
        test: "echo No Test script was found & exit 0"
    },
    license: "MIT",
    author: "",
    keywords: ["Bot"]
};

const redactconfig = {
    $schema: "https://cdn.redact.tools/libs/redactcord/RedactcordConfig.schema.json",
    main: "src/index.js",
    suspendCommandsLoading: false,
    suspendEventsLoading: false,
    eventsFolderPath: "events",
    commandsFolderPath: "commands",
    allowEnvironmentLoading: true,
    commands: []
};

function toJson(data) {
    return JSON.stringify(data, null, 4);
}

function createConfigurationFiles() {
    writeFileSync(path.join(process.cwd(), "package.json"), toJson(packageConfig));
    writeFileSync(path.join(process.cwd(), "redactcord.config.json"), toJson(redactconfig));
}

function writeFiles() {
    for (const file of files) {
        writeFileSync(path.join(process.cwd(), file), "");
    }
}

function makeDirectories() {
    for (const directory of directories) {
        mkdirSync(path.join(process.cwd(), directory), { recursive: true });
    }
}

module.exports = {
    createConfigurationFiles,
    writeFiles,
    toJson,
    makeDirectories
}