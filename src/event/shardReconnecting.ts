import type { GameBot } from '../GameBot';
import { Event } from '../structures';

export default class extends Event {
    public constructor(protected override readonly client: GameBot) {
        super(client, __filename, true);
    }

    public run(id: number): void {
        console.info(`Shard: ${id} is now reconnecting.`);
    }
}
