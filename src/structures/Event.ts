import { basename } from 'path';
import type { GameBot } from '../GameBot';

export abstract class Event {
    public readonly name: string;

    protected constructor(
        protected readonly client: GameBot,
        readonly fileName: string,
        public readonly once = false,
    ) {
        const name = basename(fileName).split('.').filter(f => !['ts', 'js'].includes(f)).join('.');
        this.name = name;
    }

    public abstract run(...args: unknown[]): void;
}
