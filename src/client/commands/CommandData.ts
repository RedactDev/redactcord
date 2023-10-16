import { RESTPostAPIChatInputApplicationCommandsJSONBody, SlashCommandBuilder } from "discord.js";

export class CommandData {

    public static createCommandData(builder: SlashCommandBuilder): CommandData {
        return new CommandData(builder);
    } 

    private slashCommandBuilder: SlashCommandBuilder;

    constructor(builder: SlashCommandBuilder) {
        this.slashCommandBuilder = builder;
    }

    public getName(): string {
        return this.slashCommandBuilder.name;
    }

    public getDescription(): string {
        return this.slashCommandBuilder.description;
    }
        
    public toJSON(): RESTPostAPIChatInputApplicationCommandsJSONBody {
        return this.slashCommandBuilder.toJSON();
    }
}