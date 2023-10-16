import path from "path";
import { FullConfiguration } from "./Configuration";
import { existsSync } from "fs";
import { RedactError } from "../error/RedactError";

export class RedactConfig extends FullConfiguration {
    public static RedactConfigName: string = "redactcord.config.json";
    public static checkRedactConfig(): boolean {
        if (!existsSync(path.join(process.cwd(), RedactConfig.RedactConfigName)))
            throw new RedactError("Config File Not Found", "Unable to find config file " + RedactConfig.RedactConfigName + " at " + process.cwd());
        return true;
    }

    constructor() {
        super(path.join(process.cwd(), RedactConfig.RedactConfigName));
    }

}