const path = require("path");
const { loadCurrentRedactConfig } = require("../../globals/ConfigurationTools");
const CommandBuilder = require("../CommandBuilder");
const figlet = require("figlet");
const chalk = require("cli-color");
const packageJSON = require("../../package.json");
const { Logger } = require("../..");

let text = `

    d8888b. d88888b d8888b.  .d8b.   .o88b. d888888b  .o88b.  .d88b.  d8888b. d8888b. 
    88  \`8D 88'     88  \`8D d8' \`8b d8P  Y8 \`oo88oo' d8P  Y8 .8P  Y8. 88  \`8D 88  \`8D 
    88oobY' 88ooooo 88   88 88ooo88 8P         88    8P      88    88 88oobY' 88   88 
    88\`8b   88ooooo 88   88 88ooo88 8b         88    8b      88    88 88\`8b   88   88 
    88 \`88. 88.     88  .8D 88   88 Y8b  d8    88    Y8b  d8 \`8b  d8' 88 \`88. 88  .8D 
    88   YD Y88888P Y8888D' YP   YP  \`Y88P'    YP     \`Y88P'  \`Y88P'  88   YD Y8888D\' v${packageJSON.version}
`

module.exports = () => {
    return CommandBuilder.createBuilder("run")
        .setDescription("Runs the current project")
        .setCallback(() => {
            
            const config = loadCurrentRedactConfig();
            const main = config["main"];

            const a = async () => {
                console.log(`${chalk.redBright(text)}`);
            }


            a().then(() => {
                if (!main || !main.length)
                    return Logger.getLogger().error("Cannot find main field or main field is empty. Please provide a main path to a javascript file.")
                const p = path.join(process.cwd(), main);
                require(p);
            })

        });
}