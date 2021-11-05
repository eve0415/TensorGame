import { layers, tensor, train } from '@tensorflow/tfjs-node';
import { Tensorflow } from './Tensorflow';
import type { TicTacToe } from '../game';

export class TicTacToeAI extends Tensorflow {
    private static instance: TicTacToeAI;

    private constructor() {
        super('tictactoe');
    }

    public static getInstance(): TicTacToeAI {
        if (!this.instance) this.instance = new this();
        return this.instance;
    }

    public override async init(): Promise<this> {
        if (this.isReady) return this;

        await super.init([
            layers.dense({ inputShape: [9], units: 64, activation: 'relu' }),
            layers.dense({ units: 64, activation: 'relu' }),
            layers.dense({ units: 9, activation: 'softmax' }),
        ], { optimizer: train.adam(0.005), loss: 'categoricalCrossentropy', metrics: ['accuracy'] });

        return this;
    }

    public async runAi(game: TicTacToe): Promise<number> {
        const move = await super.predict(tensor([game.board.map(b => {
            if (b === 1) return game.isNextX ? 1 : -1;
            if (b === 2) return game.isNextX ? -1 : 1;
            return 0;
        })]));
        let moveIndex = move.indexOf(Math.max(...move));

        while (game.board[moveIndex] !== 0) {
            move[moveIndex] = 0;
            moveIndex = move.indexOf(Math.max(...move));
        }

        return moveIndex + 1;
    }

    public train(game: TicTacToe): Promise<void> {
        const input = [], output = [];

        for (let i = 0; i < game.history.length - 1; i++) {
            const inputOrigin = (game.history[i] as number[]).map(h => {
                if (h === game.getWinner()) return 1;
                if (h === 0) return 0;
                return -1;
            });
            const [inputFirst, inputMiddle, inputLast] = [inputOrigin.slice(0, 3), inputOrigin.slice(3, 6), inputOrigin.slice(-3)];
            input.push(inputOrigin);
            input.push(inputFirst.concat().reverse().concat(inputMiddle.concat().reverse(), inputLast.concat().reverse()));
            input.push(inputLast.concat(inputMiddle.concat(), inputFirst.concat()));
            input.push(inputOrigin.concat().reverse());

            const outputOrigin = (game.history[i] as number[]).map((h, j) => {
                if (h === (game.history[i + 1] as number[])[j]) return 0;
                return 1;
            });
            const [outputFirst, outputMiddle, outputLast] = [outputOrigin.slice(0, 3), outputOrigin.slice(3, 6), outputOrigin.slice(-3)];
            output.push(outputOrigin);
            output.push(outputFirst.concat().reverse().concat(outputMiddle.concat().reverse(), outputLast.concat().reverse()));
            output.push(outputLast.concat(outputMiddle.concat(), outputFirst.concat()));
            output.push(outputOrigin.concat().reverse());
        }

        return super.trainAndSave(input, output);
    }
}

TicTacToeAI.getInstance().init();
