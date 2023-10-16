import { Collection } from "discord.js";
import { RedactCommand } from "./RedactCommand";
import { RedactClient } from "../RedactClient";
import { RedactError } from "../../error/RedactError";
import { Loader } from "../../utils/Loader";

export class CommandsManager extends Loader<RedactCommand> {

    private redactClient: RedactClient;
    private commands: Collection<string, RedactCommand> = new Collection();

    constructor(redactClient: RedactClient) {
        super();
        this.redactClient = redactClient;
    }

    public registerCommand(command: RedactCommand) {
        command.setRedactClient(this.redactClient);
        this.commands.set(command.getCommandData().getName(), command);
        return true;
    }

    public isRegistered(command: RedactCommand): boolean;
    public isRegistered(command: string): boolean;
    public isRegistered(command: RedactCommand | string): boolean {
        if (command instanceof RedactCommand)
        {
            return this.commands.has(command.getCommandData().getName());
        }
        else
        {
            return this.commands.has(command);
        }
    }

    public unregisterCommand(comamnd: RedactCommand): boolean;
    public unregisterCommand(command: string): boolean
    public unregisterCommand(command: RedactCommand | string): boolean {
        if (command instanceof RedactCommand) {
            if (!this.isRegistered(command))
                throw new RedactError("Command Not Registered", "Command is not registered. Make sure its registered before unregistering it.")
            this.commands.delete(command.getCommandData().getName());
        } else {
            if (!this.isRegistered(command))
                throw new RedactError("Command Not Registered", "Command is not registered. Make sure its registered before unregistering it.")
            this.commands.delete(command);
        }
        return true;
    }

    public loadCommands(comamndFolderPath: string) {
        const commands = this.loadFrom(comamndFolderPath, false);
        for (const command of commands) {
            this.registerCommand(command);
        }
    }

    public loadAndCall(commandFolderPath: string, callback: (command: RedactCommand) => void) {
        const commands = this.loadFrom(commandFolderPath, false);
        for (const command of commands) {
            callback(command);
            this.registerCommand(command);
        }
    }
}