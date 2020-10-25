# tail-json

Tail a file. If a line is valid JSON, parse and pretty-print it. Otherwise, just print it.

[![ci](https://github.com/jessety/tail-json/workflows/ci/badge.svg)](https://github.com/jessety/tail-json/actions)

## Install

Run `npm install` and `npm run build`, then `npm link`.

## Usage

```bash
tail-json /var/log/project-name/all.log
```

Any lines that parse as valid JSON will be pretty-printed, any that don't will be printed normally.

![Screenshot](/doc/screenshot.png)

## License

MIT © Jesse Youngblood
