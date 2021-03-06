import type { User } from 'discord.js';
import { MessageEmbed } from 'discord.js';
import type { GameTypeData } from '../structures';
import { GameType } from '../structures';

const alphabet = ['๐ฆ', '๐ง', '๐จ', '๐ฉ', '๐ช', '๐ซ', '๐ฌ', '๐ญ', '๐ฎ', '๐ฏ', '๐ฐ', '๐ฑ', '๐ฒ', '๐ณ', '๐ด', '๐ต', '๐ถ', '๐ท', '๐ธ', '๐น', '๐บ', '๐ป', '๐ผ', '๐ฝ', '๐พ', '๐ฟ'] as const;
const number = ['1๏ธโฃ', '2๏ธโฃ', ' 3๏ธโฃ', '4๏ธโฃ', '5๏ธโฃ', '6๏ธโฃ', '7๏ธโฃ', '8๏ธโฃ', '9๏ธโฃ', '๐'] as const;
const zeroSpace = 'โ' as const;

export class BoardEmbed extends MessageEmbed {
    private readonly data: GameTypeData;

    public constructor(private readonly gameType: keyof typeof GameType, embed?: MessageEmbed) {
        super(embed);

        this.data = GameType[this.gameType];
        if (!embed) {
            this.setTitle(this.data.displayName)
                .setDescription('ใกใใฅใผใใใชใใทใงใณใ้ธๆใใใใฌใคใใฟใณใๆผใใฆใใ ใใ')
                .setColor('BLURPLE')
                .addFields(Object.values(this.data.players).map(p => ({ name: p, value: 'ไธๆ', inline: true })));
        }
    }

    public setInfo(game: number, train: number): this {
        return this.setFooter(`ใใใฏ ${game} ๅ็ฎใฎใฒใผใ ใงใใ${train} ๅๅญฆ็ฟใใพใใ`);
    }

    public setBoard(board: number[]): this {
        const guiBoard = board.map(b => b === 0 ? '๐ฆ' : this.data.players[b] ?? '');

        let gui = '';
        for (let i = -1; i < this.data.boardSize; i++) {
            for (let j = -1; j < this.data.boardSize; j++) {
                if (i === -1) {
                    if (j === -1) {
                        gui += 'โฌ';
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
