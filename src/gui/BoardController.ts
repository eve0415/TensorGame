import { MessageActionRow, MessageButton, MessageSelectMenu } from 'discord.js';
import { GameType } from '../structures';

export class BoardController {
    public constructor(private readonly gameType: keyof typeof GameType) {}

    public selectPlayerMode(defaultMode?: string): MessageActionRow[] {
        return [
            new MessageActionRow().setComponents([new MessageSelectMenu({
                type: 'SELECT_MENU',
                customId: this.gameType,
                placeholder: '先行プレイヤーを選択してください',
                maxValues: 1,
                options: [
                    {
                        label: '先行',
                        description: '自分が先行',
                        value: 'first',
                        default: defaultMode === 'first',
                    },
                    {
                        label: '後攻',
                        description: 'AI が先行',
                        value: 'last',
                        default: defaultMode === 'last',
                    },
                    {
                        label: 'ランダム',
                        description: 'ボットが決める',
                        value: 'random',
                        default: defaultMode === 'random',
                    },
                ],
            })]),
            new MessageActionRow().setComponents([new MessageButton({
                type: 'BUTTON',
                style: 'PRIMARY',
                label: 'play',
                customId: 'play',
                disabled: !defaultMode,
            })]),
        ];
    }

    public controllerMode(option: number[]): MessageActionRow[] {
        const guiOption: string[] = [];
        let cell = 0;
        for (let i = 0; i < GameType[this.gameType].boardSize; i++) {
            for (let j = 0; j < GameType[this.gameType].boardSize; j++) {
                cell++;
                if (option.includes(cell)) guiOption.push(`${String.fromCharCode(j + 1 + 64)}${i + 1}`);
            }
        }

        return [new MessageActionRow().setComponents([new MessageSelectMenu({
            type: 'SELECT_MENU',
            customId: this.gameType,
            placeholder: option.length ? '設置したい場所を選択してください' : '設置できません',
            maxValues: 1,
            options: option.length ? guiOption.map((o, i) => ({ label: o, value: `${option[i]}` })) : [{ label: '設置できません', value: 'none' }],
            disabled: !option.length,
        })])];
    }
}
