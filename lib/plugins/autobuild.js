(function() {
  var CoffeeScript, autobuildPlugin, fs, jade, less, path, remarked, url, __getQuery;

  path = require('path');

  fs = require('fs');

  jade = require('jade');

  url = require('url');

  CoffeeScript = require('coffee-script');

  less = require('less');

  remarked = require('remarked');

  remarked.setOptions({
    renderer: new remarked.Renderer(),
    gfm: true,
    tables: true,
    breaks: false,
    pedantic: false,
    sanitize: true,
    smartLists: true,
    smartypants: false
  });

  __getQuery = function(req) {
    return url.parse(req.url, true).query;
  };

  autobuildPlugin = (function() {
    function autobuildPlugin() {}

    autobuildPlugin.prototype.load = function(app, settings, logger) {
      this.app = app;
      this.settings = settings;
      this.logger = logger;
      this.app.use(this._coffeeMiddleware);
      this.app.use(this._jadeMiddleware);
      this.app.use(this._markdownMiddleware);
      return this.app.use(this._lesscssMiddleware);
    };

    autobuildPlugin.prototype._jadeMiddleware = function(req, res, next) {
      var extension, result;
      extension = path.extname(req.path);
      switch (extension) {
        case '.jade':
          res.set('Content-Type', 'text/html');
          if ('source' in __getQuery(req) || 'src' in __getQuery(req)) {
            return next();
          }
          result = jade.compileFile('.' + req.path, {
            pretty: true
          });
          return res.send(result({}));
        default:
          return next();
      }
    };

    autobuildPlugin.prototype._coffeeMiddleware = function(req, res, next) {
      var extension;
      extension = path.extname(req.path);
      switch (extension) {
        case '.coffee':
        case '.cs':
          res.set('Content-Type', 'text/javascript');
          if ('source' in __getQuery(req) || 'src' in __getQuery(req)) {
            return next();
          }
          return fs.readFile('.' + req.path, {
            encoding: 'utf8'
          }, function(err, data) {
            if (!err) {
              return res.send(CoffeeScript.compile(data, {
                bare: true
              }));
            } else {
              return next();
            }
          });
        default:
          return next();
      }
    };

    autobuildPlugin.prototype._lesscssMiddleware = function(req, res, next) {
      var extension, parser;
      extension = path.extname(req.path);
      switch (extension) {
        case '.less':
          res.set('Content-Type', 'text/css');
          if ('source' in __getQuery(req) || 'src' in __getQuery(req)) {
            return next();
          }
          parser = new less.Parser({
            paths: ['.', path.dirname('.' + req.path)],
            filename: 'style.less'
          });
          return fs.readFile('.' + req.path, {
            encoding: 'utf8'
          }, function(err, data) {
            if (!err) {
              return parser.parse(data, function(e, tree) {
                if (!e) {
                  return res.send(tree.toCSS({
                    compress: false
                  }));
                } else {
                  this.logger.debug(e);
                  return next();
                }
              });
            } else {
              this.logger.debug(err);
              return next();
            }
          });
        default:
          return next();
      }
    };

    autobuildPlugin.prototype._markdownMiddleware = function(req, res, next) {
      var extension;
      extension = path.extname(req.path);
      switch (extension) {
        case '.markdown':
        case '.md':
          res.set('Content-Type', 'text/plain');
          if ('source' in __getQuery(req) || 'src' in __getQuery(req)) {
            return next();
          }
          return fs.readFile('.' + req.path, {
            encoding: 'utf8'
          }, function(err, data) {
            var result;
            if (!err) {
              result = remarked(data);
              result = result.replace(/\[ \]/g, '<input type="checkbox" onclick="event.stopPropagation(); event.preventDefault();" style="outline: none;">');
              result = result.replace(/\[(x|X|\.)\]/g, '<input type="checkbox" checked onclick="event.stopPropagation(); event.preventDefault();" style="outline: none;">');
              result = result.replace(/\( \)/g, '<input type="radio" onclick="event.stopPropagation(); event.preventDefault();" style="outline: none;">');
              result = result.replace(/\((x|X|\.)\)/g, '<input type="radio" checked onclick="event.stopPropagation(); event.preventDefault();" style="outline: none;">');
              return res.send(result);
            } else {
              return next();
            }
          });
        default:
          return next();
      }
    };

    return autobuildPlugin;

  })();

  module.exports = new autobuildPlugin();

}).call(this);
