import { Game } from '../structures';
import { TicTacToeAI } from '../tensorflow';

export class TicTacToe extends Game<TicTacToeAI> {
    public get isNextX(): boolean {
        return this.nextTurn === 1;
    }

    public constructor() {
        super(TicTacToeAI.getInstance());

        this.board = Array<number>(9).fill(0);
        this.history.push(this.board.concat());
        this.ai.totalGames++;
    }

    public play(where: number): void {
        this.board[where - 1] = this.isNextX ? 1 : 2;
        this.history.push(this.board.concat());

        this.nextTurn = this.isNextX ? 2 : 1;
    }

    public aiShouldPlay(): Promise<number> {
        return this.ai.runAi(this);
    }

    public getWinner(): number {
        const lines = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6],
        ];
        for (const [a, b, c] of lines) {
            if (this.board[a as number] && this.board[a as number] === this.board[b as number] && this.board[b as number] === this.board[c as number]) {
                return this.board[a as number] as number;
            }
        }
        return 0;
    }

    public train(): Promise<void> {
        return this.ai.train(this);
    }
}
