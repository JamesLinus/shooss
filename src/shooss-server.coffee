express = require 'express'
livereload = require 'livereload'
path = require 'path'
fs = require 'fs'

class ShoossServer

  constructor: (@config, @logger, @pluginLoader)->
    @app = express()
    @_init()

  start:()->
    port = @config.get 'port'

    @logger.debug 'starting server on port', port
    @server = @app.listen port

    if @config.get 'livereload'
      lrport = @config.get 'livereload_port'
      @logger.debug 'starting livereload server on port', lrport
      lrinterval = @config.get 'livereload_interval'
      @logger.debug 'starting livereload server with watching interval', lrinterval
      dir = @_getResolvedDir()
      @lrserver = livereload.createServer 
        port: lrport
        interval: lrinterval
      @lrserver.watch dir

  stop:()->
    return unless @server
    @server.close()

  _init:()->
    dir = @_getResolvedDir()
    @pluginLoader.inject(@app)
    @logger.info 'serving', dir, "on http://0.0.0.0:#{@config.get 'port'}"
    @app.use express.static dir
    @app.use express.directory dir

  _getResolvedDir:()->
    path.resolve @config.get 'dir'

module.exports = ShoossServer
