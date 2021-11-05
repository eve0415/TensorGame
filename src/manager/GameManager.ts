import type { CommandInteraction, Snowflake } from 'discord.js';
import { Collection } from 'discord.js';
import { GameProgressManager } from './GameProgressManager';
import { instance } from '..';
import type { GameType } from '../structures';

export class GameManager extends Collection<Snowflake, GameProgressManager> {
    private static instance: GameManager;

    private constructor() {
        super();
    }

    public static getInstance(): GameManager {
        if (!this.instance) this.instance = new this();
        return this.instance;
    }

    public override set(key: Snowflake, value: GameProgressManager): this {
        const added = super.set(key, value);
        this.updatePresence();
        return added;
    }

    public override delete(key: Snowflake): boolean {
        const removed = super.delete(key);
        this.updatePresence();
        return removed;
    }

    public async startGameConfigure(type: keyof typeof GameType, interaction: CommandInteraction<'cached'>): Promise<void> {
        const isAlredyStarted = this.get(interaction.user.id);
        if (isAlredyStarted) {
            await isAlredyStarted.isPlaying(interaction);
            return;
        }
        this.set(interaction.user.id, new GameProgressManager(type, interaction));
    }

    public async forceQuit(): Promise<void> {
        await Promise.all(this.map(g => g.finishGame(true)));
    }

    private updatePresence(): void {
        instance.user?.setActivity(`${this.size} game`, { type: 'PLAYING' });
    }
}
