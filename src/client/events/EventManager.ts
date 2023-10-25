import { Collection } from "discord.js";
import { Event } from "./Event";
import { RedactClient } from "../RedactClient";
import { readdirSync, statSync } from "fs";
import path from "path";
import { Loader } from "../../utils/Loader";
import { CommandsInteractionEvent } from "./default/CommandsInteractionEvent";

export class EventManager extends Loader<Event> {

    private redactClient: RedactClient;
    private events: Collection<string, Event> = new Collection();

    constructor(redactClient: RedactClient) {
        super();
        this.redactClient = redactClient;
        this.registerEvent(new CommandsInteractionEvent());
    }

    public registerEvent(event: Event): boolean {
        event.setRedactClient(this.redactClient);
        this.events.set(event.getEventName(), event);
        return true;
    }

    public loadEvents(eventsFolderPath: string) {
        const events = this.loadFrom(eventsFolderPath, false);
        for (const event of events) {
            this.registerEvent(event);
        }
    }

    public loadAndCall(eventsFolderPath: string, callback: (event: Event) => void) {
        const events = this.loadFrom(eventsFolderPath, false);
        for (const event of events) {
            callback(event);
            this.registerEvent(event);
        }
    }

    public getLoadedEventsAmount() {
        return this.events.size;
    }
}