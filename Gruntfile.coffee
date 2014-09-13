module.exports = (grunt) ->
  grunt.loadNpmTasks 'grunt-contrib-coffee'

  grunt.initConfig
    coffee:
      compile:
        expand: true
        flatten: true
        cwd: 'src/'
        src: ['*.coffee']
        dest: 'lib/'
        ext: '.js'
      compile_plugins: 
        expand: true
        flatten: true
        cwd: 'src/plugins/'
        src: ['*.coffee']
        dest: 'lib/plugins/'
        ext: '.js'

  grunt.registerTask 'default', ['coffee:compile', 'coffee:compile_plugins']
