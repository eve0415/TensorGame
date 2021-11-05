import type { User, TextBasedChannels, Message, Guild } from 'discord.js';
import type { Game } from '.';
import type { Tensorflow } from '../tensorflow';

export interface GameCache {
    type: typeof GameType[keyof typeof GameType];
    player: User;
    guild?: Guild;
    channel: TextBasedChannels;
    message: Message;
    game: Game<Tensorflow>;
}

export interface GameTypeData {
    name: string;
    displayName: string;
    boardSize: number;
    playersCount: number;
    players: {
        [key: number]: string;
    };
}

export const GameType: { tictactoe: GameTypeData } = {
    tictactoe: {
        name: 'tictactoe',
        displayName: '〇☓ゲーム',
        boardSize: 3,
        playersCount: 2,
        players: {
            1: '❌',
            2: '⭕',
        },
    },
} as const;
