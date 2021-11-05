import type {
    ButtonInteraction,
    ClientUser,
    CommandInteraction,
    Guild,
    Message,
    MessageEmbed,
    SelectMenuInteraction,
    TextBasedChannels,
    User,
    WebhookEditMessageOptions,
} from 'discord.js';
import { Util } from 'discord.js';
import { GameManager } from '.';
import { instance } from '..';
import { TicTacToe } from '../game';
import { BoardController, BoardEmbed } from '../gui';
import type { Game, GameTypeData } from '../structures';
import { GameType } from '../structures';
import type { Tensorflow } from '../tensorflow';

export class GameProgressManager {
    public readonly data: GameTypeData;
    public readonly player: User;
    private readonly guild: Guild | null;
    private readonly channel: TextBasedChannels | null;
    private message: Message | null = null;
    private embed!: MessageEmbed;
    private readonly game: Game<Tensorflow>;
    private turn!: number;

    public constructor(
        private readonly gameType: keyof typeof GameType,
        interaction: CommandInteraction<'cached'>,
    ) {
        this.data = GameType[this.gameType];
        this.player = interaction.user;
        this.guild = interaction.guild;
        this.channel = interaction.channel;

        this.game = new TicTacToe();

        this.startSetting(interaction);
    }

    public async startSetting(interaction: CommandInteraction<'cached'>): Promise<void> {
        this.embed = new BoardEmbed(this.gameType).setInfo(this.game.totalGames, this.game.totalTrains);
        this.message = await interaction.reply({ embeds: [this.embed], components: new BoardController(this.gameType).selectPlayerMode(), fetchReply: true });
    }

    public async isPlaying(interaction: CommandInteraction<'cached'>): Promise<void> {
        const url = `https://discord.com/channels/${this.guild?.id ?? '@me'}/${this.channel?.id}/${this.message?.id}`;
        await interaction.reply({
            ephemeral: true,
            embeds: [{
                title: 'あなたは既にゲームをしています。',
                description: '残念ながら同時に複数のゲームを実行することができません。',
                color: Util.resolveColor('RED'),
                url: url,
                fields: [
                    {
                        name: 'ゲーム名',
                        value: this.data.displayName,
                        inline: true,
                    },
                    {
                        name: 'チャンネル',
                        value: this.channel?.toString() ?? '不明',
                        inline: true,
                    },
                    {
                        name: 'メッセージ',
                        value: `[リンク](${url})`,
                        inline: true,
                    },
                ],
            }],
        });
    }

    public setPlayerTurn(turn: string): MessageEmbed {
        this.turn = turn === 'first' ? 1 : 2;
        this.embed = new BoardEmbed(this.gameType, this.embed)
            .setInfo(this.game.totalGames, this.game.totalTrains)
            .setPlayer(this.player, turn === 'first' ? 1 : 2)
            .setPlayer(instance.user as ClientUser, turn === 'first' ? 2 : 1);
        return this.embed;
    }

    public async startGame(interaction: ButtonInteraction<'cached'>): Promise<void> {
        this.embed = new BoardEmbed(this.gameType, this.embed).setBoard(this.game.board).setInfo(this.game.totalGames, this.game.totalTrains);
        await interaction.update(this.updateGui());
        if (this.turn === 1) return;

        await new Promise(resolve => setTimeout(resolve, 3000));
        this.game.play(await this.game.aiShouldPlay());
        await interaction.editReply(this.updateGui());
    }

    public async progressGame(interaction: SelectMenuInteraction<'cached'>): Promise<void> {
        const cell = Number(interaction.values[0]);
        this.game.play(cell);
        await interaction.update(this.updateGui());

        if (this.game.isFinished()) {
            await this.finishGame();
            return;
        }

        await new Promise(resolve => setTimeout(resolve, 3000));
        this.game.play(await this.game.aiShouldPlay());
        await interaction.editReply(this.updateGui());

        if (this.game.isFinished()) await this.finishGame();
    }

    public async finishGame(force = false): Promise<void> {
        if (force) {
            await this.message?.edit({ content: '申し訳ございません。ゲームが強制終了されました。', components: [] });
            return;
        }
        if (this.game.getWinner() !== 0) await this.game.train();
        GameManager.getInstance().delete(this.player.id);
    }

    private updateGui(): WebhookEditMessageOptions {
        this.embed = new BoardEmbed(this.gameType, this.embed).setBoard(this.game.board).setInfo(this.game.totalGames, this.game.totalTrains);
        return {
            content: this.game.isFinished()
                ? this.game.getWinner() === 0 ? '引き分けです。' : `${this.turn === this.game.getWinner() ? this.player.toString() : instance.user?.toString()} の勝ちです。`
                : this.turn === this.game.nextTurn ? `${this.player.toString()} の番です。` : `${instance.user?.toString()} が考えています`,
            embeds: [this.embed],
            components: this.game.isFinished() ? [] : new BoardController(this.gameType).controllerMode(this.turn === this.game.nextTurn ? this.game.getEmptyCells() : []),
            allowedMentions: { users: [this.player.id] },
        };
    }
}
