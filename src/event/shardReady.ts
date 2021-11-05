import type { GameBot } from '../GameBot';
import { Event } from '../structures';

export default class extends Event {
    public constructor(protected override readonly client: GameBot) {
        super(client, __filename, true);
    }

    public run(id: number, unavailableGuilds: Set<string> | undefined): void {
        const unavailable = unavailableGuilds?.size ?? 0;
        console.info(`Shard: ${id} is now ready.`,
            unavailable === 0 ? '' : `${unavailable} guild${unavailable === 1 ? ' is' : 's are'} unavailable ATM`);
    }
}
