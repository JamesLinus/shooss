yargs = require('yargs')
      .usage('shooss [options...]')
      .options 'd',
        alias: 'dir'
        default: '.'
        describe: 'Served files directory'
      .options 'p',
        alias: 'port'
        default: '1234'
        describe: 'Runs Shooss on the specified port'
      .options 'verbose',
        boolean: true
        describe: 'Speak to me'
      .options 'l',
        alias: 'livereload'
        boolean: false
        describe: 'Enables LiveReload'
      .options 'livereload_port',
        default: '35729'
        describe: 'Runs LiveReload on the specified port'
      .options 'livereload_interval',
        default: '100'
        describe: 'The LiveReload interval for watching files'
      .options 'f',
        alias: 'file'
        describe: 'Config file path'
      .options 'v',
        alias: 'version'
        boolean: true
        describe: 'Return actual Shooss version'
      .options 'h',
        alias: 'help'
        boolean: true
        describe: 'Displays Shooss help'
      .options 'P',
        alias: 'plugins'
        describe: 'list of plugins to be loaded'
ShoossServer = require './shooss-server'
ShoossPluginLoader = require './shooss-plugin-loader'

class ShoossCli
  constructor:(@yargs)->
    @argv = @yargs.argv

  run:(@config, @logger)=>
    if @argv.version
      @_version()
    else if @argv.help
      @_help()
    else
      @_start()

  _version: ()->
    console.log require('../package').version

  _help: ()->
    console.log @yargs.help()

  _start: ()->
    @logger.debug 'starting'

    @config.load @argv
    @config.loadFile path if path = @argv.file
    @config.validate()
    @logger.resetConfig()

    pluginLoader = new ShoossPluginLoader(@config, @logger)
    new ShoossServer(@config, @logger, pluginLoader).start()

module.exports = new ShoossCli yargs
