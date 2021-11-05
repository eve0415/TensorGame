import type { GameBot } from '../GameBot';
import { Event } from '../structures';

export default class extends Event {
    public constructor(protected override readonly client: GameBot) {
        super(client, __filename);
    }

    public run(error: Error): void {
        console.error('DJS Error -', error);
    }
}
