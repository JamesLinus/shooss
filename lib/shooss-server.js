(function() {
  var ShoossServer, express, fs, livereload, path;

  express = require('express');

  livereload = require('livereload');

  path = require('path');

  fs = require('fs');

  ShoossServer = (function() {
    function ShoossServer(config, logger, pluginLoader) {
      this.config = config;
      this.logger = logger;
      this.pluginLoader = pluginLoader;
      this.app = express();
      this._init();
    }

    ShoossServer.prototype.start = function() {
      var dir, lrinterval, lrport, port;
      port = this.config.get('port');
      this.logger.debug('starting server on port', port);
      this.server = this.app.listen(port);
      if (this.config.get('livereload')) {
        lrport = this.config.get('livereload_port');
        this.logger.debug('starting livereload server on port', lrport);
        lrinterval = this.config.get('livereload_interval');
        this.logger.debug('starting livereload server with watching interval', lrinterval);
        dir = this._getResolvedDir();
        this.lrserver = livereload.createServer({
          port: lrport,
          interval: lrinterval
        });
        return this.lrserver.watch(dir);
      }
    };

    ShoossServer.prototype.stop = function() {
      if (!this.server) {
        return;
      }
      return this.server.close();
    };

    ShoossServer.prototype._init = function() {
      var dir;
      dir = this._getResolvedDir();
      this.pluginLoader.inject(this.app);
      this.logger.info('serving', dir, "on http://0.0.0.0:" + (this.config.get('port')));
      this.app.use(express["static"](dir));
      return this.app.use(express.directory(dir));
    };

    ShoossServer.prototype._getResolvedDir = function() {
      return path.resolve(this.config.get('dir'));
    };

    return ShoossServer;

  })();

  module.exports = ShoossServer;

}).call(this);
