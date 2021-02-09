/* global module:false */
module.exports = function(grunt) {
  var port = grunt.option('port') || 8000;
  var root = grunt.option('root') || '.';

  if (!Array.isArray(root)) root = [root];

  grunt.loadNpmTasks('grunt-run');

  // Project configuration
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    meta: {
      banner:
        '/*!\n' +
        ' * Presentation <%= pkg.version %> (<%= grunt.template.today("yyyy-mm-dd, HH:MM") %>)\n' +
        ' * https://kubuszok.com\n' +
        ' * MIT licensed\n' +
        ' *\n' +
        ' * Copyright (C) 2020 Mateusz Kubuszok, https://kubuszok.com\n' +
        ' */'
    },
    
    run: {
        prebuild: {
            cmd: 'yarn',
            args: ['run', 'prebuild']
        }
    },

    sass: {
      core: {
        src: 'css/reveal.scss',
        dest: 'css/reveal.css'
      },
      themes: {
        expand: true,
        cwd: 'css/theme/source',
        src: ['*.sass', '*.scss'],
        dest: 'css/theme',
        ext: '.css'
      }
    },

    autoprefixer: {
      core: {
        src: 'css/reveal.css'
      }
    },

    cssmin: {
      options: {
        compatibility: 'ie9'
      },
      compress: {
        src: 'css/reveal.css',
        dest: 'css/reveal.min.css'
      }
    },

    connect: {
      server: {
        options: {
          port: port,
          base: root,
          livereload: true,
          open: true,
          useAvailablePort: true
        }
      }
    },

    zip: {
      bundle: {
        src: [
          'index.html',
          'css/**',
          'js/**',
          'lib/**',
          'images/**',
          'plugin/**',
          '**.md'
        ],
        dest: 'reveal-js-presentation.zip'
      }
    },

    watch: {
      asciidoc: {
        files: [ 'index.adoc' ],
        tasks: 'prebuild'
      },
      js: {
        files: [ 'Gruntfile.js', 'js/reveal.js' ],
        tasks: 'js'
      },
      theme: {
        files: [
          'css/theme/source/*.sass',
          'css/theme/source/*.scss',
          'css/theme/template/*.sass',
          'css/theme/template/*.scss'
        ],
        tasks: 'css-themes'
      },
      css: {
        files: [ 'css/reveal.scss' ],
        tasks: 'css-core'
      },
      html: {
        files: root.map(path => path + '/*.html')
      },
      markdown: {
        files: root.map(path => path + '/*.md')
      },
      options: {
        livereload: true
      }
    },

    retire: {
      js: [ 'js/reveal.js', 'lib/js/*.js', 'plugin/**/*.js' ],
      node: [ '.' ]
    }

  });

  // Dependencies
  grunt.loadNpmTasks( 'grunt-contrib-connect' );
  grunt.loadNpmTasks( 'grunt-contrib-cssmin' );
  grunt.loadNpmTasks( 'grunt-contrib-watch' );
  grunt.loadNpmTasks( 'grunt-autoprefixer' );
  grunt.loadNpmTasks( 'grunt-retire' );
  grunt.loadNpmTasks( 'grunt-sass' );
  grunt.loadNpmTasks( 'grunt-zip' );
  
  // Default task
  grunt.registerTask( 'default', [ 'css', 'js' ] );

  // JS task
  grunt.registerTask( 'js', [] );

  // Theme CSS
  grunt.registerTask( 'css-themes', [ 'sass:themes' ] );

  // Core framework CSS
  grunt.registerTask( 'css-core', [ 'sass:core', 'autoprefixer', 'cssmin' ] );

  // All CSS
  grunt.registerTask( 'css', [ 'sass', 'autoprefixer', 'cssmin' ] );

  // Package presentation to archive
  grunt.registerTask( 'package', [ 'default', 'zip' ] );

  // Serve presentation locally
  grunt.registerTask( 'serve', [ 'connect', 'watch' ] );
  
  // Rebuild ASCIIDocs
  grunt.registerTask( 'prebuild', [ 'run:prebuild' ]);

};
