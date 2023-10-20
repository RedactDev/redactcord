const { readFileSync } = require("fs");
const path = require("path");
const { configName } = require("./InitializationUtils");

function loadCurrentRedactConfig() {
    return JSON.parse(readFileSync(path.join(process.cwd(), configName), "utf-8"));
}

module.exports = {
    loadCurrentRedactConfig
};