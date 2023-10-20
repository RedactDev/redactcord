const CommandBuilder = require("../CommandBuilder");
const Nanospinner = require("nanospinner");
const spinner = Nanospinner.createSpinner();
const InitializationTools = require('../../globals/InitializationUtils');

const maxSteps = 5;
let currentStep = 1;

function startStep(text) {
    spinner.start({
        text: `${text} (${currentStep}/${maxSteps})`
    });
}

function step(text) {
    currentStep++;
    if (currentStep >= maxSteps)
        return end(text, true);
    spinner.update({
        text: `${text} (${currentStep}/${maxSteps})`
    });
}

function end(text, success) {
    
    if (success) {
        spinner.success({
            text: `${text} (${currentStep}/${maxSteps})`
        });
    } else {
        spinner.stop({
            text: `${text} (${currentStep}/${maxSteps})`
        });
    }

}

module.exports = () => CommandBuilder.createBuilder("init")
    .setDescription("Creates a new Redactcord project")
    .setCallback(() => {

        startStep("Creating Directories...");

        InitializationTools.makeDirectories();

        step("Creating Files");

        InitializationTools.writeFiles();
        
        step("Creating configuraitons");

        InitializationTools.createConfigurationFiles();

        step("Installing Required dependencies")

        //InitializationTools.installRequired();

        step("Done! Created All Files");

    });