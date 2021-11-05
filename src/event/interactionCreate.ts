import type { Interaction } from 'discord.js';
import type { GameBot } from '../GameBot';
import { BoardController } from '../gui';
import { GameManager } from '../manager';
import type { GameType } from '../structures';
import { Event } from '../structures';

export default class extends Event {
    public constructor(protected override readonly client: GameBot) {
        super(client, __filename);
    }

    public async run(interaction: Interaction<'cached'>): Promise<void> {
        console.trace('Recieved interaction event');

        if (interaction.isCommand()) {
            await this.client.commandManager.get(interaction.commandName)?.run(interaction);
            return;
        }

        if (!interaction.isMessageComponent()) return;

        const gameProgess = GameManager.getInstance().get(interaction.user.id);

        if (!gameProgess) return;
        if (!gameProgess.player.equals(interaction.user)) {
            await interaction.reply({ content: 'あなたはこれを操作することはできません。', ephemeral: true });
            return;
        }

        if (interaction.isSelectMenu()) {
            const choice = interaction.values[0] as string;
            if (!choice.match(/^\d+$/)) {
                const turn = choice === 'random' ? ['first', 'last'][Math.floor(Math.random() * 2)] as string : choice;
                await interaction.update({
                    embeds: [gameProgess.setPlayerTurn(turn)],
                    components: new BoardController(interaction.customId as keyof typeof GameType).selectPlayerMode(choice),
                });
                return;
            }
            await gameProgess.progressGame(interaction);
        }
        if (interaction.isButton()) {
            await gameProgess.startGame(interaction);
        }
    }
}
