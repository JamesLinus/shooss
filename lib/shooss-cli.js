(function() {
  var ShoossCli, ShoossPluginLoader, ShoossServer, yargs,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  yargs = require('yargs').usage('shooss [options...]').options('d', {
    alias: 'dir',
    "default": '.',
    describe: 'Served files directory'
  }).options('p', {
    alias: 'port',
    "default": '1234',
    describe: 'Runs Shooss on the specified port'
  }).options('verbose', {
    boolean: true,
    describe: 'Speak to me'
  }).options('l', {
    alias: 'livereload',
    boolean: false,
    describe: 'Enables LiveReload'
  }).options('livereload_port', {
    "default": '35729',
    describe: 'Runs LiveReload on the specified port'
  }).options('livereload_interval', {
    "default": '100',
    describe: 'The LiveReload interval for watching files'
  }).options('f', {
    alias: 'file',
    describe: 'Config file path'
  }).options('v', {
    alias: 'version',
    boolean: true,
    describe: 'Return actual Shooss version'
  }).options('h', {
    alias: 'help',
    boolean: true,
    describe: 'Displays Shooss help'
  }).options('P', {
    alias: 'plugins',
    describe: 'list of plugins to be loaded'
  });

  ShoossServer = require('./shooss-server');

  ShoossPluginLoader = require('./shooss-plugin-loader');

  ShoossCli = (function() {
    function ShoossCli(yargs) {
      this.yargs = yargs;
      this.run = __bind(this.run, this);
      this.argv = this.yargs.argv;
    }

    ShoossCli.prototype.run = function(config, logger) {
      this.config = config;
      this.logger = logger;
      if (this.argv.version) {
        return this._version();
      } else if (this.argv.help) {
        return this._help();
      } else {
        return this._start();
      }
    };

    ShoossCli.prototype._version = function() {
      return console.log(require('../package').version);
    };

    ShoossCli.prototype._help = function() {
      return console.log(this.yargs.help());
    };

    ShoossCli.prototype._start = function() {
      var path, pluginLoader;
      this.logger.debug('starting');
      this.config.load(this.argv);
      if (path = this.argv.file) {
        this.config.loadFile(path);
      }
      this.config.validate();
      this.logger.resetConfig();
      pluginLoader = new ShoossPluginLoader(this.config, this.logger);
      return new ShoossServer(this.config, this.logger, pluginLoader).start();
    };

    return ShoossCli;

  })();

  module.exports = new ShoossCli(yargs);

}).call(this);
