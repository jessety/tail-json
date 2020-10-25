import Tail, { TailFileOptions } from 'tail-file';

import { EventEmitter } from 'events';
import path from 'path';
import fs from 'fs';

export default class TailJSON extends EventEmitter {

  private tail: Tail;
  private printLastLines: number
  private current: boolean
  private lines: string[] = []

  constructor(filename: string, printLastLines = 10) {
    super();

    const filepath = path.resolve(filename);

    if (fs.existsSync(filepath) === false) {
      throw new Error(`File does not exist.`);
    }

    this.printLastLines = printLastLines;

    const tailOptions: TailFileOptions =  {};

    if (printLastLines > 0) {

      tailOptions.startPos = 'start';
      this.current = false;

    } else {

      this.current = true;
    }

    this.tail = new Tail(filename, tailOptions);

    this.tail.on('error', (error: Error) => this.emit('error', error));

    this.tail.on('line', (line: string) => this.handleLine(line));

    this.tail.on('eof', () => {

      this.current = true;

      for (const line of this.lines) {
        this.handleLine(line);
      }

      this.lines = [];
    });
  }

  private handleLine(line: string): void {

    if (this.current === false) {

      this.lines.push(line);

      if (this.lines.length > this.printLastLines) {
        this.lines.shift();
      }
      return;
    }

    try {

      const json = JSON.parse(line);
      this.emit('line', json);

    } catch (error) {

      this.emit('line', line);
    }
  }

  public start(): Promise<void> {
    return this.tail.startP();
  }

  public stop(): Promise<void> {
    return this.tail.stop();
  }
}
