const CommandBuilder = require("../CommandBuilder")

module.exports = () => {
    return CommandBuilder.createBuilder("version")
        .setDescription("Displays CLI Version")
        .setCallback(() => {
            console.log(require("../../package").version);
        });
}