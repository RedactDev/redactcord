import { Client, ClientOptions } from "discord.js";
import { RedactConfig } from "../configuration/RedactConfig";
import NanoSpinner from "nanospinner";
import { RedactError } from "../error/RedactError";
import { CommandsManager } from "./commands/CommandsManager";
import { EventManager } from "./events/EventManager";
import path from "path";

type RedactOptions = ClientOptions & {
    token: string;
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
    public endSpinner(spinnerOptions: NanoSpinner.Options): boolean {
        if (!this.startedSpinner)
            return false;

        this.spinner.stop(spinnerOptions);
        this.startedSpinner = false;
        return true;
    }

    public startOrUpdate(spinnerOptions?: NanoSpinner.Options) {
        if (this.isSpinnerStarted())
        {
            this.spinner.update(spinnerOptions);
        } else {
            this.spinner.start(spinnerOptions);
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

        this.startOrUpdate({
            text: "Started Loading Commands from folder \"" + commandFolderPath + "\"..."
        });

        this.commandsManager.loadAndCall(commandFolderPath, (command) => {
            this.startOrUpdate({
                text: "Started Loading Commands from folder \"" + commandFolderPath + "\"... Command: " + command.getCommandData().getName() 
            });
        });

        this.startOrUpdate({
            text: "Started Loading Events from folder \"" + eventFolderPath + "\"..."
        });

        this.eventManager.loadAndCall(eventFolderPath, (event) => {
            this.startOrUpdate({
                text: "Started Loading Events from folder \"" + eventFolderPath + "\"... Event: " + event.getEventName()
            });
        });

        this.endSpinner({
            text: "Done! Loaded in " + performance.now() + "ms"
        });
    }

    public async login(): Promise<boolean> {
        this.startClient();
        this.startOrUpdate({
            text: `Trying to login into client... (${this.loginTry}/${this.maxLoginTry})`
        });
        const token = this.options.token;
        try {
            await this.client.login(token);
        } catch (err) {
            const itry = this.incrementLoginTry();
            if (itry >= this.maxLoginTry)
                throw new RedactError("Maximum Tries Exceeded", "The login tries has hit the maximum limit which is " + this.maxLoginTry);
            await this.login();
        }
        return true;
    }
}