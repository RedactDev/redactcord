const CommandBuilder = require("../CommandBuilder");
const Templates = require("@redactcord/templates");
const simpleGit = require("simple-git");
const git = simpleGit.default(process.cwd())

module.exports = () => {
    return CommandBuilder.createBuilder("template")
        .setDescription("Displays or Creates templates")
        .addArgument("[template]")
        .setCallback((template) => {
            const templates = Templates.TEMPLATES;
            if (!template) {

                if (!templates.length)
                    return console.log("No Templates are found at this current time. templates package may have not been updated in the main package");

                let tab = `     `;
                let string = ``;

                for (const template of templates) {
                    string += `${tab}|-${template}\n`;
                }

                console.log(string.trim());
            } else {

                const index = templates.indexOf(template);
                if (index == -1)
                    return console.log("Not Present in the templates list.");
                const templateValue = templates[index];
                const url = `${Templates.GithubPrefix}${templateValue}`;

                git.clone(url, process.cwd()).then((value) => {
                    console.log("Cloned Template " + templateValue + " to " + process.cwd());
                });
            }
                
        });
}