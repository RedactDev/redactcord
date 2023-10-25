import { Interaction } from "discord.js";
import { InteractionEvent } from "./InteractionEvent";
import { CommandFinishResult } from "../../commands/CommandFinishResult";
import { RedactError } from "../../../error/RedactError";
import { isString } from "lodash";

export class CommandsInteractionEvent extends InteractionEvent {
    public onEvent(...args: Interaction[]): void {
        
        const interaction = this.takeFirst<Interaction>(...args);
        if (!interaction)
            return;

            
        if (!interaction.isCommand() || !interaction.inCachedGuild() || interaction.isContextMenuCommand() || interaction.isUserContextMenuCommand())
            return;
        const commandName = interaction.commandName;

        if (this.getRedactClient().getCommandsManager().isRegistered(commandName)) {
            const command = this.getRedactClient().getCommandsManager().getCommand(commandName);
            if (!command) return;

            const result: CommandFinishResult = command.onInteractionExecute(interaction);
            if (result.isError()) {
                if (this.getRedactClient().getErrorHandler() != undefined) {
                    const errorHandler = this.getRedactClient().getErrorHandler();
                    if (!errorHandler) return;
                    errorHandler.reportError(errorHandler.renderError(result.getErrorValue()));
                } else {
                    const redactError: RedactError = new RedactError("Command Thrown Error", result.getErrorValue());
                    throw redactError;
                }
            } else {
                if (result.isResultVoid()) return;
                const resultValue = result.getResultValue();
                if (!isString(resultValue)) return;
                if (!interaction.deferred) interaction.deferReply();
                interaction.followUp({
                    content: resultValue,
                    ephemeral: true
                });
            }
        } else {
            interaction.deferReply();
            interaction.reply({
                content: "No command was registered by this name."
            });
            return;
        }
    }
    
}