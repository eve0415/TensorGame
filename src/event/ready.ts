import type { GameBot } from '../GameBot';
import { Event } from '../structures';

export default class extends Event {
    public constructor(protected override readonly client: GameBot) {
        super(client, __filename, true);
    }

    public async run(): Promise<void> {
        console.info('Succesfully logged in and is Ready.');
        console.trace(`Cached ${this.client.guilds.cache.size} guild${this.client.guilds.cache.size <= 1 ? '' : 's'}`);

        console.info('Starting to subscribe commands to Discord Server');
        await this.client.commandManager.subscribe()
            .then(() => console.info('Succesfully subscribed commands to Discord Server'))
            .catch(e => console.error('There was an error subscribing', e));
    }
}
