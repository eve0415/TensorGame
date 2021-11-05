import { existsSync, mkdirSync } from 'fs';
import { GameBot } from './GameBot';

if (!existsSync('model')) mkdirSync('model');

export const instance = new GameBot();
instance.start().catch(console.error);

['SIGTERM', 'SIGINT'].forEach(signal =>
    process.on(signal, () => instance.stop().catch(e => console.error(e))));

['uncaughtException', 'unhandledRejection'].forEach(signal =>
    process.on(signal, e => console.error(signal, e)));
