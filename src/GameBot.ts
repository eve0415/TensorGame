import { Client } from 'discord.js';
import { EventManager, CommandManager, GameManager } from './manager';

export class GameBot extends Client {
    private readonly eventManager: EventManager;
    public readonly commandManager: CommandManager;

    public constructor() {
        super({
            intents: ['GUILDS'],
            restTimeOffset: 0,
            allowedMentions: { repliedUser: false },
            http: { api: 'https://canary.discord.com/api' },
        });

        this.eventManager = new EventManager(this);
        this.commandManager = new CommandManager(this);
        GameManager.getInstance();
    }

    public async start(): Promise<void> {
        await this.eventManager.registerAll().catch(e => console.error(e));
        await this.commandManager.registerAll().catch(e => console.error(e));
        await super.login();
    }

    public async stop(): Promise<void> {
        await GameManager.getInstance().forceQuit();
        this.destroy();
    }
}
