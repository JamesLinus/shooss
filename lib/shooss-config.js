(function() {
  var config, convict;

  convict = require('convict');

  config = convict({
    verbose: {
      doc: 'Speak to me',
      "default": false
    },
    port: {
      doc: 'Runs Shuss on the specified port',
      format: 'port',
      "default": '1234',
      env: 'SHOOSS_PORT'
    },
    dir: {
      doc: 'Served files directory',
      "default": '.',
      env: 'SHOOSS_DIR'
    },
    livereload: {
      doc: 'Enables LiveReload',
      "default": false,
      env: 'SHOOSS_LR'
    },
    livereload_port: {
      doc: 'The LiveReload server port',
      "default": 35729,
      env: 'SHOOSS_LR_PORT'
    },
    livereload_interval: {
      doc: 'The LiveReload interval for watching files',
      "default": 100,
      env: 'SHOOSS_LR_INTERVAL'
    },
    plugins: {
      doc: 'The list of plugins to be loaded',
      "default": ''
    }
  });

  config.validate();

  module.exports = config;

}).call(this);
