import type { CommandInteraction } from 'discord.js';
import type { GameBot } from '../GameBot';
import { GameManager } from '../manager';
import { Command, GameType } from '../structures';

export default class extends Command {
    public constructor(protected override readonly client: GameBot) {
        super(client, {
            name: 'play',
            description: 'ゲームをプレイ',
            options: [{
                type: 'STRING',
                name: 'game',
                description: 'ゲーム名',
                choices: Object.values(GameType).map(g => ({ name: g.displayName, value: g.name })),
                required: true,
            }],
        });
    }

    public async run(interaction: CommandInteraction<'cached'>): Promise<void> {
        await GameManager.getInstance().startGameConfigure(interaction.options.getString('game', true) as keyof typeof GameType, interaction);
    }
}
