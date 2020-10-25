#!/usr/bin/env node

import TailJSON from './TailJSON.js';
// As of October 2020, including the .js suffix in TypeScript is required when targeting native modules

const [filename] = process.argv.slice(2);

if (filename === undefined || filename === '') {
  console.error(`Missing parameter: Please call \`tail-json\` with the path to a file to tail`);
  process.exit(1);
}

try {

  const tail = new TailJSON(filename);

  tail.on('line', (line: string | unknown) => {

    if (typeof line === 'string') {

      console.log(line);

    } else {

      console.dir(line);
    }
  });

  tail.on('error', error => console.error(error));

  tail.start();

} catch (error) {

  console.error(error);
  process.exit(1);
}
