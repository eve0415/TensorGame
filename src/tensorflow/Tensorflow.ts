import { existsSync } from 'fs';
import type { Layer } from '@tensorflow/tfjs-layers/dist/exports_layers';
import type { LayersModel, ModelCompileArgs, Tensor } from '@tensorflow/tfjs-node';
import { loadLayersModel, sequential, stack } from '@tensorflow/tfjs-node';
import type { GameType } from '../structures';

export class Tensorflow {
    private model!: LayersModel;
    private ready = false;

    public totalGames = 0;
    public totalTrains = 0;

    protected constructor(private readonly type: keyof typeof GameType) {}

    public get isReady(): boolean {
        return this.ready;
    }

    protected async init(layer: Layer[], compileOption: ModelCompileArgs): Promise<this> {
        if (!existsSync(`./model/${this.type}/model.json`)) {
            const model = sequential({ layers: layer });
            model.compile(compileOption);
            await model.save(`file://./model/${this.type}`);
        }

        this.model = await loadLayersModel(`file://./model/${this.type}/model.json`);
        this.model.compile(compileOption);
        this.ready = true;

        return this;
    }

    protected async predict(tensor: Tensor): Promise<Float32Array | Int32Array | Uint8Array> {
        if (!this.isReady) throw new Error('Not ready');

        const prediction = this.model.predict(tensor) as Tensor;
        const move = await prediction.flatten().data();

        return move;
    }

    protected async trainAndSave(input: (0 | 1 | -1)[][], output: (0 | 1 | -1)[][]): Promise<void> {
        await this.model.fit(stack(input), stack(output), {
            epochs: 100,
            shuffle: true,
            batchSize: 32,
        });

        this.totalTrains++;

        await this.model.save('file://./model/tictactoe');
    }
}
