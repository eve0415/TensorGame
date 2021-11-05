import type { Tensorflow } from '../tensorflow';

export abstract class Game<T extends Tensorflow> {
    public nextTurn = 1;
    public board: number[] = [];
    public history: number[][] = [];

    public constructor(protected readonly ai: T) {
        if (!ai.isReady) throw new Error('AI is not ready');
    }

    public get totalGames(): number {
        return this.ai.totalGames;
    }

    public get totalTrains(): number {
        return this.ai.totalTrains;
    }

    public abstract play(where: number): void;

    public abstract aiShouldPlay(): Promise<number>;

    public getEmptyCells(): number[] {
        return this.board.map((b, i) => b === 0 ? i + 1 : null).filter(f => f) as number[];
    }

    public isFinished(): boolean {
        if (this.getWinner()) return true;
        return this.getEmptyCells().length === 0;
    }

    public abstract getWinner(): number;

    public abstract train(): Promise<void>;
}
