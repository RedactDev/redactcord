const { execSync } = require("child_process");
const { writeFileSync, mkdirSync } = require("fs");
const path = require("path");
const yaml = require('yaml');

const configName = "redactcord.config.json";
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
const requiredDependencies = [
    "redactcord",
]

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

const redactDatabaseConfig = {
    enabled: false,
    type: "flat",
    flat: {
        filePath: "example.db"
    },
    mongo: {
        url: "mongo:?/"
    },
    postgre: {
        url: "postgres://"
    },
    mysql: {
        host: "127.0.0.1",
        user: "root",
        database: "example",
        password: "password"
    }
}

function toJson(data) {
    return JSON.stringify(data, null, 4);
}

function createConfigurationFiles() {
    writeFileSync(path.join(process.cwd(), "package.json"), toJson(packageConfig));
    writeFileSync(path.join(process.cwd(), configName), toJson(redactconfig));
    writeFileSync(path.join(process.cwd(), "redact.database.yml"), yaml.stringify(redactDatabaseConfig));
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

function executeNpm(command) {
    execSync("npm " + command);
}

function install(dependency) {
    executeNpm("install " + dependency);
}

function installMultiple(...dependencies) {
    executeNpm("install " + dependencies.join(" "));
}

function installRequired() {
    installMultiple(...requiredDependencies);
}

module.exports = {
    createConfigurationFiles,
    writeFiles,
    toJson,
    makeDirectories,
    configName,
    install,
    executeNpm,
    installMultiple,
    installRequired
}