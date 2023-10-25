import { Client, ClientOptions, REST, Routes } from "discord.js";
import { RedactConfig } from "../configuration/RedactConfig";
import NanoSpinner from "nanospinner";
import { RedactError } from "../error/RedactError";
import { CommandsManager } from "./commands/CommandsManager";
import { EventManager } from "./events/EventManager";
import path from "path";
import { Logger } from "../logger/Logger";
import Color from "cli-color";
import { RedactErrorHandler } from "./errors/RedactErrorHandler";

type RedactRestOptions = {
    enabled: boolean,
    global?: boolean,
    /**
     * Used if the global variable is not enabled.
     */
    guildId?: string,
}

type RedactOptions = ClientOptions & {
    token: string;
    restOptions?: RedactRestOptions;
};

export class RedactClient {

    private client: Client;
    private options: RedactOptions;
    private config: RedactConfig;
    private spinner: NanoSpinner.Spinner = NanoSpinner.createSpinner();
    private loginTry: number = 1;
    private maxLoginTry: number = 3;
    private startedSpinner: boolean = false;
    private commandsManager: CommandsManager;
    private eventManager: EventManager;
    private readyEvent?: () => void;
    private logger: Logger = Logger.getLogger();
    private errorHandler?: RedactErrorHandler;

    constructor(options: RedactOptions) {
        this.client = new Client(options);
        this.options = options;
        RedactConfig.checkRedactConfig();
        this.config = new RedactConfig();
        this.commandsManager = new CommandsManager(this);
        this.eventManager = new EventManager(this);
    }

    public startSpinner(spinnerOptions?: NanoSpinner.Options): boolean {
        if (this.startedSpinner)
            return false;
        this.spinner.start(spinnerOptions);
        this.startedSpinner = true;
        return true;
    }
    public endSpinner(spinnerOptions: NanoSpinner.Options, success: boolean = false): boolean {
        if (!this.startedSpinner)
            return false;

        if (success) {
            this.spinner.success(spinnerOptions);
        } else {
            this.spinner.stop(spinnerOptions);
        }
        this.startedSpinner = false;
        return true;
    }

    public initErrorHandler(errorHandler: RedactErrorHandler) {
        this.errorHandler = errorHandler;
    }

    public getErrorHandler(): RedactErrorHandler | undefined {
        return this.errorHandler;
    }

    public onReadyEvent(event: () => void) {
        this.readyEvent = event;
    }

    public startOrUpdate(spinnerOptions?: NanoSpinner.Options) {
        if (this.isSpinnerStarted())
        {
            this.spinner.update(spinnerOptions);
        } else {
            this.spinner.start(spinnerOptions);
            this.startedSpinner = true;
        }
    }

    public isSpinnerStarted(): boolean {
        return this.startedSpinner;
    }

    public getClient(): Client {
        return this.client;
    }

    public getOptions(): RedactOptions {
        return this.options;
    }

    public getCommandsManager(): CommandsManager {
        return this.commandsManager;
    }

    public getEventManager(): EventManager {
        return this.eventManager;
    }

    public getRedactConfig(): RedactConfig {
        return this.config;
    }

    private incrementLoginTry() {
        this.loginTry++;
        return this.loginTry;
    }

    public async startClient(): Promise<void> {
        let eventFolderPath = this.getRedactConfig().getString("eventFolderPath");
        let commandFolderPath = this.getRedactConfig().getString("commandsFolderPath");
        if (!eventFolderPath)
            eventFolderPath = path.join(process.cwd(), "events");
        if (!commandFolderPath)
            commandFolderPath = path.join(process.cwd(), "commands");

        const suspendCommandLoading = this.getRedactConfig().has("suspendCommandsLoading") && this.getRedactConfig().getBoolean("suspendCommandsLoading")
        const suspendEventLoading = this.getRedactConfig().has("suspendEventsLoading") && this.getRedactConfig().getBoolean("suspendEventsLoading")

        if (!suspendCommandLoading)
        {
            this.startOrUpdate({
                text: "Started Loading Commands from folder \"" + commandFolderPath + "\"..."
            });
    
            this.commandsManager.loadAndCall(commandFolderPath, (command) => {
                this.startOrUpdate({
                    text: "Started Loading Commands from folder \"" + commandFolderPath + "\"... Command: " + command.getCommandData().getName() 
                });
            });
        }

        if (!suspendEventLoading) {
            this.startOrUpdate({
                text: "Started Loading Events from folder \"" + eventFolderPath + "\"..."
            });
    
            this.eventManager.loadAndCall(eventFolderPath, (event) => {
                this.startOrUpdate({
                    text: "Started Loading Events from folder \"" + eventFolderPath + "\"... Event: " + event.getEventName()
                });
            });
        }

        this.client.on("ready", () => {
            this.endSpinner({
                text: "API Connected!"
            }, true);

            this.restify();

            this.logger.info(`Connected to ${Color.greenBright(this.getBotUsername())} at ${Color.greenBright(new Date().toUTCString())}`);
            this.logger.info(` ├── Loaded ${Color.yellow(this.getCommandsManager().getLoadedCommandsAmount())} number of commands`)
            this.logger.info(` ├── Loaded ${Color.yellow(this.getEventManager().getLoadedEventsAmount())} number of events`);
            this.logger.info(` └── Amount of servers ${Color.yellow(this.getClient().guilds.cache.size)}`);

            if (this.readyEvent)
                this.readyEvent();
        });

        this.endSpinner({
            text: "Done! Loaded in " + performance.now() + "ms"
        });
    }

    private async restify(): Promise<void> {

        const rest = new REST({
            version: "10"
        }).setToken(this.options.token);

        const id = this.getClient().user?.id;
        if (!id) return;

        const json = this.commandsManager.jsonifyCommands();
        const restOptions = this.options.restOptions;
        if (!restOptions)
            return;
        if (!restOptions.enabled) return;
        const isGlobal = restOptions.global != undefined && restOptions.global == true;
        try {
            if (isGlobal) {
                await rest.put(Routes.applicationCommands(id), {
                    body: json
                });
            } else {
                const guildId = restOptions.guildId;
                if (!guildId)
                    throw new RedactError("Rest Error", "Invalid guild id. Provide a guild id for non global application commands.");
                await rest.put(Routes.applicationGuildCommands(id, guildId), {
                    body: json
                })
            }
            this.logger.info("Loaded Application (/) Commands successfully.")
        } catch (err) {
            throw new RedactError("Rest Error", err as string);
        }

    }

    public getBotUsername(): string | undefined {
        return this.getClient().user?.username;
    }

    public async login(): Promise<boolean> {
        await this.startClient();
        this.startOrUpdate({
            text: `Trying to login into client... (${this.loginTry}/${this.maxLoginTry})`
        });
        const token = this.options.token;
        try {
            await this.client.login(token);
        } catch (err) {
            const itry = this.incrementLoginTry();
            if (itry >= this.maxLoginTry)
            {
                this.spinner.error({
                    text: `Trying to login into client... (${this.loginTry}/${this.maxLoginTry})`,
                })
                throw new RedactError("Maximum Tries Exceeded", "The login tries has hit the maximum limit which is " + this.maxLoginTry);
            }
            await this.login();
        }
        return true;
    }
}