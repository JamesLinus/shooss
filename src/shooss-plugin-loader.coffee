express = require 'express'
basicAuth = require './plugins/basic-auth'
autobuildPlugin = require './plugins/autobuild'

class ShoossPluginLoader
  constructor: (@config, @logger)->
    pluginNames = @config.get "plugins"
    @plugins = []

    return unless pluginNames

    @logger.debug "Loading plugins [#{pluginNames}]"

    @loadPlugin(pluginName) for pluginName in pluginNames.split(',')

  loadPlugin: (pluginName)->
    @logger.debug "Loading plugin #{pluginName}"
    try
      @plugins.push require "shooss-#{pluginName}"
      @logger.debug "Loaded plugin #{pluginName}"
    catch error
      throw "Unable to find plugin #{pluginName}. Install it globally with:\n
      npm install -g shooss-#{pluginName}"

  inject: (app)->
    @logger.debug "Injecting plugins"

    #internal plugins
    if @config.has('username') and @config.has('password')
      @logger.debug 'load plugin basic-auth'
      basicAuth.load(app, @config, @logger)
    
    @logger.debug 'load plugin autobuild'
    autobuildPlugin.load(app, @config, @logger)
    
    for plugin in @plugins
      plugin.load(server.app, express, @config)

  module.exports = ShoossPluginLoader
