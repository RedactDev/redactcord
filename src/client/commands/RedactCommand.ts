import { ChatInputCommandInteraction, Message } from "discord.js";
import { RedactError } from "../../error/RedactError";
import { RedactClient } from "../RedactClient";
import { CommandData } from "./CommandData";
import { CommandFinishResult } from "./CommandFinishResult";

type MessageArguments = string[];

export abstract class RedactCommand {

    private client?: RedactClient;
    private commandData: CommandData;


    constructor(commandData: CommandData) {
        this.commandData = commandData;
    }

    public setRedactClient(redactClient: RedactClient) {
        this.client = redactClient;
    }

    public getRedactClient(): RedactClient {
        if (!this.client)
        {
            throw new RedactError("Redact Client Not Found", "Redact Client has been set to null in the event class.");
        } else {
            return this.client;
        }
    }

    public getCommandData(): CommandData {
        return this.commandData;
    }

    public abstract onInteractionExecute(interaction: ChatInputCommandInteraction<"cached">): CommandFinishResult;
    public abstract onMessageExecute(message: Message, messageArguments: MessageArguments): CommandFinishResult;
}