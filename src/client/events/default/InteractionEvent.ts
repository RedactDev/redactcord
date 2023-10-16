import { Interaction } from "discord.js";
import { Event } from "../Event";

export abstract class InteractionEvent extends Event {

    constructor() {
        super("interactionCreate");
    }

    public abstract onEvent(...args: Interaction[]): void;

}