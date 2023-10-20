const fs = require("fs");
const watch = require("watch");
const _eval = require("eval");
const CommandBuilder = require("../CommandBuilder");
const path = require("path");

function HandleWatcher() {
    watch.watchTree(process.cwd(), {
        filter: (path, stat) => {
            console.log(path);
            return stat.isFile() && (path.endsWith(".js") || path.endsWith(".ts"))
        }
    }, (f, curr, prev) => {
        const data = fs.readdirSync(curr, "utf-8");
        _eval(data);
    });
}

module.exports = () => {
    return CommandBuilder.createBuilder("watch")
        .setDescription("Watches all files in the main directory")
        .setCallback((options) => {
            console.log(`[${new Date().toUTCString()}]: Started Watching files in the current directory.`);
            HandleWatcher();
        });
}