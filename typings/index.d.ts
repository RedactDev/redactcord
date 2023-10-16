import { ChatInputCommandInteraction, Client, ClientOptions, Collection, Interaction, Message, RESTPostAPIChatInputApplicationCommandsJSONBody, SlashCommandBuilder } from "discord.js";
import NanoSpinner from "nanospinner";

type RedactOptions = ClientOptions & {
    token: string;
}

export class RedactClient {

    constructor(options: RedactOptions)

    public startSpinner(spinnerOptions: NanoSpinner.Options): boolean;
    public endSpinner(spinnerOptions: NanoSpinner.Options, success: boolean = false): boolean;
    public startOrUpdate(spinnerOption?: NanoSpinner.Options): void;
    public isSpinnerStarted(): boolean;
    public getClient(): Client;
    public getOptions(): RedactOptions;
    public getCommandsManager(): CommandsManager;
    public getEventManager(): EventManager;
    public getRedactConfig(): RedactConfig;
    private incrementLoginTry(): number;
    public getBotUsername(): string | undefined;
    public startClient(): Promise<void>;
    public login(): Promise<boolean>;
}

export class CommandsManager extends Loader<RedactCommand> {

    public registerCommand(command: RedactCommand): boolean;
    public isRegistered(command: RedactCommand): boolean;
    public isRegistered(command: string): boolean;
    public unregisterCommand(command: RedactCommand): boolean;
    public unregisterCommand(command: string): boolean;
    public loadCommands(commandFolderPath: string): void;
    public loadAndCall(commandFolderPath: string, callback: (command: RedactCommand) => void): void;

}

export class Loader<E> {
    public loadFrom(folder: string, deep: boolean = false): E[];
}

export class EventManager extends Loader<Event> {

    public registerEvent(event: Event): boolean;
    public loadEvents(eventFolderPath: string): void;
    public loadAndCall(eventFolderPath: string, callback: (event: Event) => void): void;

}

export abstract class InteractionEvent extends Event {

    public abstract onEvent(...args: Interaction[]): void;

}

export class CommandsInteractionEvent extends InteractionEvent {

}

type MessageArguments = string[];

export abstract class RedactCommand {

    public setRedactClient(redactClient: RedactClient): void;
    public getRedactClient(): RedactClient;
    public getCommandData(): CommandData;
    public abstract onInteractionExecute(interaction: ChatInputCommandInteraction<"cached">): CommandFinishResult;
    public abstract onMessageExecute(message: Message, arguments: MessageArguments): CommandFinishResult

}

export abstract class Configuration extends Collection<string, object> {

    constructor(filePath: string, contents: Record<string, object>);

    getBoolean(key: string): boolean | undefined;
    getString(key: string): string | undefined;
    getNumber(key: string): number | undefined;
    /**
     * @deprecated Use Configuration#toJson instead
     */
    toJSON(): object[];
    toJson(): Record<string, object>
    isEmpty(): this is EmptyConfiguration;
    isFilled(): this is FullConfiguration;


    public save(): void;
}

export class EmptyConfiguration extends Configuration {

    constructor(filePath: string);

}

export class FullConfiguration extends Configuration {

    constructor(filePath: string);

}

export class RedactConfig extends FullConfiguration {
    public static RedactConfigName: string;
    public static checkRedactConfig(): boolean;

    constructor();
}

export class RedactError extends Error {
    constructor(name: string, message: string);
}

export class Environment extends Collection<string, string> {
    constructor();

    public load(): void;
}

export class CommandFinishResult {
    constructor(isVoid: boolean, value?: any);

    public isResultVoid(): boolean;
    public setError(error: string): void;
    public getErrorValue(): string;
    public isError(): boolean;
    public getResultValue(): any | undefined;
}

export class CommandData {
    public static createCommandData(builder: SlashCommandBuilder): CommandData;

    constructor(builder: SlashCommandBuilder);

    public getName(): string;
    public getDescription(): string;
    public toJSON(): RESTPostAPIChatInputApplicationCommandsJSONBody;
}

export abstract class Event {

    public getRedactClient(): RedactClient;
    public setRedactClient(client: RedactClient): void;
    public getEventName(): string;
    public abstract onEvent(...args: any[]): void;
    public takeFirst<V>(...args: V[]): V | undefined;

}