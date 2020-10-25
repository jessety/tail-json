import TailJSON from '../src/TailJSON';

import path from 'path';
import os from 'os';
import fs from 'fs';

describe('TailJSON class', () => {

  // Before running any tests, create a test folder in the temporary directory

  const directory = path.resolve(os.tmpdir(), 'tail-json-test');

  beforeAll(async () => {

    if (fs.existsSync(directory) === true) {
      await fs.promises.rmdir(directory, { recursive: true });
    }

    await fs.promises.mkdir(directory, { recursive: true });
  });

  test('throws when created with an invalid file path', () => {

    const filePath = path.join(directory, 'doesNotExist.log');

    expect(() => new TailJSON(filePath)).toThrow();
  });

  test('does not throw when created with a valid file path', async () => {

    const filePath = path.join(directory, 'exists.log');

    await fs.promises.writeFile(filePath, '');

    expect(() => {
      const tail = new TailJSON(filePath);
      tail.stop();
    }).not.toThrow();
  });

  test('parses content as JSON when possible', async (done) => {
    expect.assertions(1);

    const filePath = path.join(directory, 'json-output.log');

    await fs.promises.writeFile(filePath, '');

    const tail = new TailJSON(filePath);

    tail.on('line', async line => {

      await tail.stop();

      expect(line).toEqual([1, 2, 3, 'a b c']);

      done();
    });

    await tail.start();

    await fs.promises.appendFile(filePath, '[1,2,3,"a b c"]\n');
  });

  test('outputs a string when the result is not parseable', async (done) => {
    expect.assertions(1);

    const filePath = path.join(directory, 'string-output.log');

    await fs.promises.writeFile(filePath, '');

    const tail = new TailJSON(filePath);

    tail.on('line', async line => {

      await tail.stop();

      expect(line).toEqual('just some log text');

      done();
    });

    await tail.start();

    await fs.promises.appendFile(filePath, 'just some log text\n');
  });

  test('outputs the last 10 lines by default', async (done) => {
    expect.assertions(1);

    const filePath = path.join(directory, 'history.log');

    await fs.promises.writeFile(filePath, [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,''].join('\n'));

    const tail = new TailJSON(filePath);

    const received: number[] = [];

    tail.on('line', async line => {

      received.push(line as number);

      if (received.length !== 10) {
        return;
      }

      await tail.stop();

      expect(received.join(',')).toEqual('6,7,8,9,10,11,12,13,14,15');

      done();
    });

    await tail.start();
  });

  test('doesn\'t output any history when set not to ', async (done) => {
    expect.assertions(1);

    const filePath = path.join(directory, 'history-disabled.log');

    await fs.promises.writeFile(filePath, [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,''].join('\n'));

    const tail = new TailJSON(filePath, 0);

    tail.on('line', async line => {

      await tail.stop();

      expect(line).toEqual('just some log text');

      done();
    });

    await tail.start();

    await fs.promises.appendFile(filePath, 'just some log text\n');
  });

  // After all tests have run, delete the test folder and everything in it

  afterAll(() => {
    return fs.promises.rmdir(directory, { recursive: true });
  });
});
