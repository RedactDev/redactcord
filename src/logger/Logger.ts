import Color from "cli-color";

export class Logger {

    public static getLogger(): Logger {
        return new Logger();
    }

    constructor() {}

    public log(level: "INFO" | "WARN" | "ERROR" | "DEBUG", text: string): void {

        switch (level) {
            case "INFO":
            {
                this.info(text);
                break;
            }
            case "WARN":
            {
                this.warn(text);
                break;
            }
            case "DEBUG":
            {
                this.debug(text);
                break;
            }
            case "ERROR":
            {
                this.error(text);
                break;
            }
        }
    }

    private background(text: string): string {
        return Color.bgWhiteBright(text);
    }
    
    public info(text: string): void {
        let tformat = `${this.background(Color.greenBright(`INFO >`))} ${text}`;
        console.log(tformat);
    }
    public warn(text: string): void {
        let tformat = `${this.background(Color.yellowBright(`INFO >`))} ${text}`;
        console.log(tformat);
    }
    public error(text: string): void {
        let tformat = `${this.background(Color.redBright(`INFO >`))} ${text}`;
        console.log(tformat);
    }
    public debug(text: string): void {
        let tformat = `${this.background(Color.magentaBright(`INFO >`))} ${text}`;
        console.log(tformat);
    }

}