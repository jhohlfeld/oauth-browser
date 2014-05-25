'use strict';

module.exports = function(grunt) {

  // Load grunt tasks automatically
  require('load-grunt-tasks')(grunt);

  // Time how long tasks take. Can help when optimizing build times
  require('time-grunt')(grunt);

  grunt.initConfig({

    // project settings
    cfg: {
      src: require('./bower.json').srcPath || 'src'
    },

    // Watches files for changes and runs tasks based on the changed files
    watch: {
      js: {
        files: ['<%= cfg.src %>/scripts/{,*/}*.js'],
        tasks: ['newer:jshint:all'],
        options: {
          livereload: true
        }
      },
      jsTest: {
        files: ['test/spec/{,*/}*.js'],
        tasks: ['newer:jshint:test', 'karma']
      },
      styles: {
        files: ['<%= cfg.src %>/styles/{,*/}*.css'],
        tasks: ['newer:copy:styles', 'autoprefixer']
      },
      sass: {
        files: ['<%= cfg.src %>/styles/{,*/}*.scss'],
        tasks: ['sass:development']
      },
      gruntfile: {
        files: ['Gruntfile.js']
      },
      livereload: {
        options: {
          livereload: '<%= connect.options.livereload %>'
        },
        files: [
          '<%= cfg.src %>/**/*.html',
          '.tmp/styles/{,*/}*.css',
          '<%= cfg.src %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
        ]
      }
    },

    // The actual grunt server settings
    connect: {
      options: {
        port: 4000,
        // Change this to '0.0.0.0' to access the server from outside.
        hostname: '127.0.1.2',
        livereload: 35729
      },
      livereload: {
        options: {
          open: false,
          base: [
            '.tmp',
            '<%= cfg.src %>'
          ]
        }
      },
      dist: {
        options: {
          base: '<%= cfg.dist %>'
        }
      }
    },

    // Empties folders to start fresh
    clean: {
      development: {
        files: [{
          dot: true,
          src: [
            '.tmp',
            // '<%= cfg.src %>/lib/**'
          ]
        }]
      },
      server: '.tmp'
    },

    // Make sure code styles are up to par and there are no obvious mistakes
    jshint: {
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish')
      },
      all: [
        'Gruntfile.js',
        '<%= cfg.src %>/scripts/{,*/}*.js'
      ]
    },

    // bower install
    bower: {
      install: {
        options: {
          install: false,
          layout: 'byComponent',
          targetDir: '<%= cfg.src %>/lib',
          cleanTargetDir: false,
          verbose: false
        }
      }
    },

    // less processing
    less: {
      development: {
        options: {
          paths: [
            'bower_components/'
          ]
        },
        files: {
          '.tmp/styles/main.css': '<%= cfg.src %>/less/main.less'
        }
      }
    },

    // Copies remaining files to places other tasks can use
    // copy: {
    //   styles: {
    //     expand: true,
    //     cwd: '<%= cfg.src %>/styles',
    //     dest: '.tmp/styles/',
    //     src: '{,*/}*.css'
    //   }
    // },

    // Run some tasks in parallel to speed up the build process
    // concurrent: {
    //   server: [
    //     'copy:styles'
    //   ]
    // },

  });

  grunt.registerTask('serve', function(target) {
    if (target === 'dist') {
      return grunt.task.run(['build', 'connect:dist:keepalive']);
    }

    grunt.task.run([
      'clean:development',
      'bower:install',
      'less:development',
      // 'concurrent:server',
      // 'autoprefixer',
      'connect:livereload',
      'watch'
    ]);
  });

  grunt.registerTask('dev', ['bower:install', 'less:development']);
  grunt.registerTask('default', ['dev']);
};
