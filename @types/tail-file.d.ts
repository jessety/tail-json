import { EventEmitter } from 'events';

declare module 'tail-file' {

  declare interface TailFileOptions {
    startPos?: 'start' | 'end' | number = 'end'
  }

  export default class Tail extends EventEmitter {
    constructor(filePath: string, options?: TailFileOptions)
    startP(): Promise<void>;
    stop(): Promise<void>;
  }
}
