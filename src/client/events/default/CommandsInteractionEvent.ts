import { Interaction } from "discord.js";
import { InteractionEvent } from "./InteractionEvent";

export class CommandsInteractionEvent extends InteractionEvent {
    public onEvent(...args: Interaction[]): void {
        const interaction = this.takeFirst(args);
        if (!interaction)
            return;

        
    }
    
}