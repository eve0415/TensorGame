import type { ChatInputApplicationCommandData, Interaction } from 'discord.js';
import type { GameBot } from '../GameBot';

export abstract class Command {
    protected constructor(
        protected readonly client: GameBot,
        public readonly data: ChatInputApplicationCommandData,
    ) {}

    public abstract run(interaction: Interaction): Promise<void>;
}
