import type { CloseEvent } from 'discord.js';
import type { GameBot } from '../GameBot';
import { Event } from '../structures';

export default class extends Event {
    public constructor(protected override readonly client: GameBot) {
        super(client, __filename, true);
    }

    public run(event: CloseEvent, id: number): void {
        console.info(`Shard: ${id} has disconnected.`, `Code: ${event.code}, Reason: ${event.reason}`);
    }
}
