import { EmbedField } from "discord.js";
import { RedactClient, RedactError } from ".";

export class RedactErrorHandler {

    constructor(redactClient: RedactClient, guildId: string, channelId: string)

    setDescription(description: string);
    getDescription(): string;
    setErrorField(field: EmbedField);
    getErrorField(): EmbedField;
    setDateField(field: EmbedField);
    getDateField(): EmbedField;
    reportError(error: Error): Promise<boolean>
    renderError(message: string): RedactError
}