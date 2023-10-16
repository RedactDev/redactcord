import { RedactError } from "../../error/RedactError";
import { RedactClient } from "../RedactClient";

export abstract class Event {

    private eventName: string;
    private redactClient?: RedactClient;

    constructor(eventName: string) {
        this.eventName = eventName;
    }

    public setRedactClient(redactClient: RedactClient) {
        this.redactClient = redactClient;
    }

    public getRedactClient(): RedactClient {
        if (!this.redactClient)
        {
            throw new RedactError("Redact Client Not Found", "Redact Client has been set to null in the event class.");
        } else {
            return this.redactClient;
        }
    }

    public getEventName(): string {
        return this.eventName;
    }

    public abstract onEvent(...args: any[]): void;

    public takeFirst<V>(...args: V[]): V | undefined {
        return args.shift();
    }

}