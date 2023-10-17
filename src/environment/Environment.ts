import { Collection } from "discord.js";
import dotenv from "dotenv";
import path from "path";
import { RedactConfig } from "../configuration/RedactConfig";
import { RedactError } from "../error/RedactError";

export class Environment extends Collection<string, string> {

    private content: dotenv.DotenvParseOutput;
    constructor() {
        super();
        this.content = dotenv.parse(path.join(process.cwd(), ".redact.env"));
        RedactConfig.checkRedactConfig();
        const redactConfig = new RedactConfig();
        const allowEnvironmentLoading: boolean = 
            redactConfig.has("allowEnvironmentLoading") 
            && 
            redactConfig.getBoolean("allowEnvironmentLoading") as boolean;
        if (!allowEnvironmentLoading)
            throw new RedactError("Environment Error", "Trying to access environment while environment is disabled");

        this.load();
    }

    public load(): void {
        for (const [key, value] of Object.entries(this.content)) {
            this.set(key, value);
        }
    }

}