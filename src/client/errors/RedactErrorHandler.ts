import { ChannelType, EmbedBuilder, EmbedField } from "discord.js";
import { RedactClient } from "../RedactClient";
import { RedactError } from "../../error/RedactError";

export class RedactErrorHandler {

    private redactClient: RedactClient;
    private guildId: string;
    private channelId: string;
    private description: string;
    private errorField: EmbedField;
    private dateField: EmbedField;

    constructor(redactClient: RedactClient, guildId: string, channelId: string) {
        this.redactClient = redactClient;
        this.guildId = guildId;
        this.channelId = channelId;
        this.description = "An error occured while trying to run the bot.";
        this.errorField = {
            name: "Error",
            value: "%error_value%",
            inline: true
        };
        this.dateField = {
            name: "Date",
            value: "%date%",
            inline: true
        };
    }

    setDescription(description: string) {
        this.description = description;
    }

    getDescription(): string {
        return this.description;
    }

    setErrorField(field: EmbedField) {
        this.errorField = field;
    }

    getErrorField(): EmbedField {
        return this.errorField;
    }

    setDateField(field: EmbedField) {
        this.dateField = field;
    }

    getDateField(): EmbedField {
        return this.dateField;
    }

    async reportError(error: Error) {
        const stack = error.stack ? error.stack : "";
        this.errorField.value = this.errorField.value.replace("%error_value%", `\`\`\`${stack}\`\`\``);
        this.dateField.value = this.dateField.value.replace("%date%", new Date().toUTCString())
        const embed = new EmbedBuilder()
            .setDescription(this.description)
            .setFields(this.errorField, this.dateField);

        const guild = this.redactClient.getClient().guilds.cache.get(this.guildId);
        if (!guild)
            throw error;
        const channel = await guild.channels.fetch(this.channelId);
        if (!channel)
            throw error;
        if (!channel.isTextBased() || channel.type !== ChannelType.GuildText)
            throw error;
        channel.send({
            embeds: [embed]
        });
        return true;
    }

    renderError(message: string): RedactError {
        return new RedactError("Error handler Thrown Error", message);
    }
}