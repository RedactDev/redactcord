import { Collection, RESTPostAPIApplicationCommandsJSONBody } from "discord.js";
import { RedactCommand } from "./RedactCommand";
import { RedactClient } from "../RedactClient";
import { RedactError } from "../../error/RedactError";
import { Loader } from "../../utils/Loader";

export class CommandsManager extends Loader<RedactCommand> {

    private redactClient: RedactClient;
    private commands: Collection<string, RedactCommand> = new Collection();
    private registeredCommandNames: string[];

    constructor(redactClient: RedactClient) {
        super();
        this.redactClient = redactClient;
        let v = this.redactClient.getRedactConfig().getArray<string>("commands");
        if (!v)
            v = [];
        this.registeredCommandNames = v;
    }

    public getCommand(command: string): RedactCommand | undefined {
        return this.commands.get(command);
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

    public getLoadedCommandsAmount(): number {
        return this.commands.size;
    }

    public loadAndCall(commandFolderPath: string, callback: (command: RedactCommand) => void) {
        const commands = this.loadFrom(commandFolderPath, false);
        for (const command of commands) {
            if (!this.registeredCommandNames.includes(command.getCommandData().getName()))
                throw new RedactError("Command Loader Error", "Couldn't Register command \"" + command.getCommandData().getName() + "\" because it's not found in redact.config.json commands array");
            callback(command);
            this.registerCommand(command);
        }
    }

    public jsonifyCommands(): RESTPostAPIApplicationCommandsJSONBody[] {
        const commands: RESTPostAPIApplicationCommandsJSONBody[] = [];
        
        for (const [key, value] of this.commands) {
            commands.push(
                value.getCommandData().toJSON()
            );
        }

        return commands;
    }
}