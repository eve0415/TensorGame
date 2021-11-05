import { readdirSync } from 'fs';
import { resolve } from 'path';
import { Collection } from 'discord.js';
import type { GameBot } from '../GameBot';
import { Event } from '../structures';

export class EventManager extends Collection<string, Event> {
    public constructor(private readonly client: GameBot) {
        super();
    }

    public register(event: Event): void {
        if (event.once) {
            this.client.once(event.name, event.run.bind(event));
        } else {
            this.client.on(event.name, event.run.bind(event));
        }
        this.set(event.name, event);
    }

    public unregister(key: string): void {
        const event = this.get(key);
        if (event) this.client.removeListener(event.name, event.run.bind(event));
        this.delete(key);
    }

    public async registerAll(): Promise<void> {
        const dir = resolve(`${__dirname}/../event`);
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return,@typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
        const modules = await Promise.all(readdirSync(dir).filter(file => /.js|.ts/.exec(file)).map(file => import(`${dir}/${file}`).then(a => new a.default(this.client))));
        const events = modules.filter<Event>((value): value is Event => value instanceof Event);
        await Promise.all(events.map(event => this.register(event)));
    }

    public async unregisterAll(): Promise<void> {
        await Promise.all(this.map(e => this.unregister(e.name)));
    }
}
