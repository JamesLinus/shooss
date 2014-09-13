(function() {
  var ShoossBasicAuth, express,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  express = require('express');

  ShoossBasicAuth = (function() {
    function ShoossBasicAuth() {
      this._check = __bind(this._check, this);
    }

    ShoossBasicAuth.prototype.load = function(app, settings, logger) {
      this.app = app;
      this.settings = settings;
      this.logger = logger;
      this.username = this.settings.get('username');
      this.password = this.settings.get('password');
      if (!(this.username && this.password)) {
        throw "No http basic auth username and password given";
      }
      return this.app.use(express.basicAuth(this._check));
    };

    ShoossBasicAuth.prototype._check = function(username, password, callback) {
      return username === this.username && password === this.password;
    };

    return ShoossBasicAuth;

  })();

  module.exports = new ShoossBasicAuth();

}).call(this);
