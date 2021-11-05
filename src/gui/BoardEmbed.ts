import type { User } from 'discord.js';
import { MessageEmbed } from 'discord.js';
import type { GameTypeData } from '../structures';
import { GameType } from '../structures';

const alphabet = ['🇦', '🇧', '🇨', '🇩', '🇪', '🇫', '🇬', '🇭', '🇮', '🇯', '🇰', '🇱', '🇲', '🇳', '🇴', '🇵', '🇶', '🇷', '🇸', '🇹', '🇺', '🇻', '🇼', '🇽', '🇾', '🇿'] as const;
const number = ['1️⃣', '2️⃣', ' 3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟'] as const;
const zeroSpace = '​' as const;

export class BoardEmbed extends MessageEmbed {
    private readonly data: GameTypeData;

    public constructor(private readonly gameType: keyof typeof GameType, embed?: MessageEmbed) {
        super(embed);

        this.data = GameType[this.gameType];
        if (!embed) {
            this.setTitle(this.data.displayName)
                .setDescription('メニューからオプションを選択し、プレイボタンを押してください')
                .setColor('BLURPLE')
                .addFields(Object.values(this.data.players).map(p => ({ name: p, value: '不明', inline: true })));
        }
    }

    public setInfo(game: number, train: number): this {
        return this.setFooter(`これは ${game} 回目のゲームです。${train} 回学習しました`);
    }

    public setBoard(board: number[]): this {
        const guiBoard = board.map(b => b === 0 ? '🟦' : this.data.players[b] ?? '');

        let gui = '';
        for (let i = -1; i < this.data.boardSize; i++) {
            for (let j = -1; j < this.data.boardSize; j++) {
                if (i === -1) {
                    if (j === -1) {
                        gui += '⬛';
                        continue;
                    }
                    gui += `${zeroSpace}${alphabet[j]}`;
                    continue;
                }
                if (j === -1) {
                    gui += `\n${number[i]}`;
                    continue;
                }
                gui += `${guiBoard[i * this.data.boardSize + j]}`;
            }
        }

        this.setDescription(gui);
        return this;
    }

    public setPlayer(player: User, turn: number): this {
        this.fields = this.fields.map((f, i) => i === turn - 1 ? { name: f.name, value: player.toString(), inline: true } : f);
        return this;
    }
}
