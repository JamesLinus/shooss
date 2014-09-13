# shooss - super http u* static server [![NPM version](https://badge.fury.io/js/shooss.png)](http://badge.fury.io/js/shooss)

Super simple yet comprehensive static files server. Shooss :ski:

## Credits

Based on [Shuss](https://github.com/ArnaudRinquin/shuss) by ArnaudRinquin

## Installation

Shooss requires [`Node.js`](http://nodejs.org/) to run.

```shell
npm install shooss
```

You'd probably want it in available globally, with:

```shell
npm install -g shooss
```

### Livereload

To enjoy the pleasure of the livereload feature, just follow the official browser extension [installation guide](http://feedback.livereload.com/knowledgebase/articles/86242-how-do-i-install-and-use-the-browser-extensions-). Easy.

## Settings

Shooss loads settings in that order:

1. `defaults`
2. `env`
3. `-f <file>`
4. `cli args`

There are very few settings, all defaulted.

* port: `1234`
* dir: `'.'`
* livreload: `false`
* livereloadport: `35729`
* verbose: `false`

### CLI usage
```shell
$ > shooss -h
shooss [options...]

Options:
  -d, --dir          Served files directory                 [default: "."]
  -p, --port         Runs Shooss on the specified port       [default: "1234"]
  --verbose          Speak to me
  -l, --livereload   Enables LiveReload
  --livereload_port  Runs LiveReload on the specified port  [default: "35729"]
  -f, --file         Config file path
  -v, --version      Return actual Shooss version
  -h, --help         Displays Shooss help
```

Default usage:

```shell
$ > shooss
info: serving /Users/arnaud/projects/shooss on http://0.0.0.0:1234
```

Specific port and livereload (on default port):

```shell
$ > shooss -p 6543 -l
info: serving /Users/arnaud/projects/shooss on http://0.0.0.0:6543
```
Now with verbose, specified, port and livereload port

```shell
$ > shooss -p 6543 --verbose -l --livereload_port 6523
info: serving /Users/romain/Projects/shooss on http://0.0.0.0:6543
debug: starting server on port 6543
debug: starting livereload server on port 6523
```

### ENV variables

Shooss can load settings from these self-explanatory values:

* `SHUSS_PORT`
* `SHUSS_LR`
* `SHUSS_LR_PORT`
* `SHUSS_DIR`
* `SHUSS_VERBOSE`

### JSON File

You can specify a config file to load:
```
$ > shooss -f config.json
```

It is expected to contain json, like in this:
```
$ > cat config.json
{
  "port":8000,
  "livereload": true,
  "livereloadport": 9854,
  "verbose": true,
  "dir": "./public"
}
```

## plugins

While being very simple, Shooss can handle complexe plugins.

### Using a plugin

To use a plugin, you will probably have to install them in the same scope as shooss. Chances are you must install them globaly:

```
npm i -G shooss-my-awesome-plugin
```

Then, you just have to specify the comma separated list of plugins you want to use, along with their own arguments. Here is an example with `shooss-basic-auth`

```
shooss --plugins basic-auth --username admin --password foobar
```

### Available plugins

* [shooss-basic-auth](https://github.com/shootshoot/shooss-basic-auth): basic HTTP auth plugin


### Writing a plugin

A plugin is a npm package prefixed by `shooss-`. Plugins can act on:

* the underlaying [Express](http://expressjs.com/) app,
* the [Express](http://expressjs.com/) object (i.e `require(express)`),
* the [convict](https://github.com/mozilla/node-convict) settings object

You are allowed to add your own cli args.

All they have to define is a `load(app, express, config)` function. See the [`basic-auth`](https://github.com/shootshoot/shooss-basic-auth/blob/master/lib/shooss-basic-auth.coffee) example.

## Development

All Shooss Node.js module are written in CoffeeScript.

In order to use correctly the `shooss` binary, you have to compile them in JavaScript.

It can be done through:

```bash
$ grunt coffee:compile
```

Or more easily:

```bash
$ grunt
```

## Todo

### Features

* test config solver, urgent, not how to do it yet, maybe [`node-env-file`](https://www.npmjs.org/package/node-env-file)
* any idea?

### Integration

So much to do!

* grunt-shooss
* gulp-shooss
* atom-shooss
* sublime-shooss
* younameit-shooss

## Contributing

[Contributors](https://github.com/shootshoot/shooss/graphs/contributors) and [CONTRIBUTING](https://github.com/shootshoot/shooss/blob/master/CONTRIBUTING.md)

## License

Released under the MIT License. See the [LICENSE](https://github.com/shootshoot/shooss/blob/master/LICENSE.md) file for further details.
