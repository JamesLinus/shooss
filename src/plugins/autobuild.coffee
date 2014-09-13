path = require 'path'
fs = require 'fs'
jade = require 'jade'
url = require 'url'
CoffeeScript = require 'coffee-script'
less = require 'less'

# markdown = require( "markdown" ).markdown
# marked = require('marked')
remarked = require('remarked')
remarked.setOptions 
  renderer: new remarked.Renderer()
  gfm: true
  tables: true
  breaks: false
  pedantic: false
  sanitize: true
  smartLists: true
  smartypants: false

# Helper function to get query vars parsed
__getQuery = (req) ->
  url.parse(req.url, true).query

class autobuildPlugin
  load: (@app, @settings, @logger) ->
    @app.use @_coffeeMiddleware
    @app.use @_jadeMiddleware
    @app.use @_markdownMiddleware
    @app.use @_lesscssMiddleware
  _jadeMiddleware: (req, res, next) ->
    extension = path.extname(req.path)
    switch extension
      when '.jade'
        res.set('Content-Type', 'text/html')
        return next() if 'source' of __getQuery(req) or 'src' of __getQuery(req)
        result = jade.compileFile('.'+req.path, {pretty: true})
        res.send result({})
      else
        next()
  _coffeeMiddleware: (req, res, next) ->
    extension = path.extname(req.path)
    switch extension
      when '.coffee', '.cs'
        res.set('Content-Type', 'text/javascript')
        return next() if 'source' of __getQuery(req) or 'src' of __getQuery(req)
        fs.readFile '.'+req.path, {encoding: 'utf8'}, (err, data) ->
          # console.log data
          unless err
            res.send CoffeeScript.compile data, bare: on
          else 
            next()
      else
        next()
  _lesscssMiddleware: (req, res, next) ->
    extension = path.extname(req.path)
    switch extension
      when '.less'
        res.set('Content-Type', 'text/css')
        return next() if 'source' of __getQuery(req) or 'src' of __getQuery(req)
        parser = new(less.Parser)({
          paths: ['.', path.dirname('.'+req.path)] # Specify search paths for @import directives
          filename: 'style.less' # Specify a filename, for better error messages
        })
        fs.readFile '.'+req.path, {encoding: 'utf8'}, (err, data) ->
          # console.log data
          unless err
            parser.parse data, (e, tree) ->
              unless e
                res.send tree.toCSS( 
                  # Minify CSS output
                  compress: false
                )
              else
                @logger.debug e
                next()
          else 
            @logger.debug err
            next()
      else
        next()
  _markdownMiddleware: (req, res, next) ->
    extension = path.extname(req.path)
    switch extension
      when '.markdown', '.md'
        res.set('Content-Type', 'text/plain')
        return next() if 'source' of __getQuery(req) or 'src' of __getQuery(req)
        fs.readFile '.'+req.path, {encoding: 'utf8'}, (err, data) ->
          # console.log data
          unless err
            result = remarked(data)
            # result = marked(data)
            # result = markdown.toHTML(data)
            result = result.replace(/\[ \]/g, '<input type="checkbox" onclick="event.stopPropagation(); event.preventDefault();" style="outline: none;">')
            result = result.replace(/\[(x|X|\.)\]/g, '<input type="checkbox" checked onclick="event.stopPropagation(); event.preventDefault();" style="outline: none;">')
            result = result.replace(/\( \)/g, '<input type="radio" onclick="event.stopPropagation(); event.preventDefault();" style="outline: none;">')
            result = result.replace(/\((x|X|\.)\)/g, '<input type="radio" checked onclick="event.stopPropagation(); event.preventDefault();" style="outline: none;">')
            res.send result
          else 
            next()
      else
        next()

module.exports = new autobuildPlugin()
