module.exports = function(grunt) {
  require('time-grunt')(grunt);
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    cwd: process.cwd(),

    // Watch task
    watch: {
      images: {
        files: ['src/img/**/*.{png,jpg,gif,svg}'],
        tasks: ['newer:imagemin'],
        options: {
          event: ['changed', 'added'],
          cwd: '<%= cwd %>',
          spawn: false
        }
      },
      javascript: {
        files: ['src/js/**/*.*'],
        tasks: ['concat', 'uglify'],
        options: {
          spawn: false
        }
      },
      jekyll: {
        files: ['src/**/*.*'],
        tasks: ['shell:build'],
        options: {
          spawn: false,
          livereload: true,
        }
      }
    },

    // Copy source Bootstrap assets
    copy: {
      sass: {
        files: [{
          expand: true,
          cwd: 'node_modules/bootstrap-sass/assets/stylesheets',
          src: ['bootstrap/**', '_bootstrap.scss'],
          dest: 'src/_sass'
        }]
      },
      js: {
        files: [{
          expand: true,
          cwd: 'node_modules/bootstrap-sass/assets/javascripts',
          src: 'bootstrap/**',
          dest: 'src/js'
        }, {
          expand: true,
          cwd: 'node_modules/jquery/dist',
          src: ['jquery.min.js', 'jquery.min.map'],
          dest: 'src/js'
        }]
      },
      fonts: {
        files: [{
          expand: true,
          cwd: 'node_modules/bootstrap-sass/assets/fonts/bootstrap',
          src: '**',
          dest: 'src/fonts/bootstrap'
        }]
      }
    },

    // Concat JavaScript files located in /src/js/bootstrap and /src/js/scripts
    concat: {
      bootstrap: {
        // Using a manual concat ordering as popover.js explicitly relies on tooltip.js
        src: [
          'src/js/bootstrap/affix.js',
          'src/js/bootstrap/alert.js',
          'src/js/bootstrap/button.js',
          'src/js/bootstrap/carousel.js',
          'src/js/bootstrap/collapse.js',
          'src/js/bootstrap/dropdown.js',
          'src/js/bootstrap/modal.js',
          'src/js/bootstrap/tooltip.js',
          'src/js/bootstrap/popover.js',
          'src/js/bootstrap/scrollspy.js',
          'src/js/bootstrap/tab.js',
          'src/js/bootstrap/transition.js',
        ],
        dest: 'src/js/bootstrap.js'
      },
      scripts: {
        src: ['src/js/scripts/**.js'],
        dest: 'src/js/<%= pkg.name %>.js'
      }
    },

    // Minify concatenated JavaScript files located in /src/js/
    uglify: {
      options: {
        compress: {
          warnings: false
        },
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n',
        mangle: true,
        sourceMap: true,
        preserveComments: /^!|@preserve|@license|@cc_on/i
      },
      bootstrap: {
        files: {
          'src/js/bootstrap.min.js': ['src/js/bootstrap.js']
        }
      },
      site: {
        files: {
          'src/js/<%= pkg.name %>.min.js': ['src/js/<%= pkg.name %>.js']
        }
      }
    },

    // Optimize images
    imagemin: {
      options: {
        optimizationLevel: 7,
        svgoPlugins: [{
          removeViewBox: false
        }],
      },
      dynamic: {
        files: [{
          expand: true,
          cwd: 'src/img',
          src: ['**/*.{png,jpg,gif,svg}'],
          dest: 'src/img',
          cache: false
        }]
      }
    },

    // Linters


    // Shell tasks
    shell: {
      serve: {
        command: 'cd <%= cwd %> && node server'
      },
      build: {
        command: 'cd <%= cwd %>/src && jekyll build --drafts'
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-imagemin');
  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-newer');

  grunt.registerTask('bootstrap', ['copy:sass', 'copy:js']);
  grunt.registerTask('jsconcat', ['concat']);
  grunt.registerTask('jsmin', ['uglify']);
  grunt.registerTask('image', ['newer:imagemin']);
  grunt.registerTask('serve', ['shell:serve']);
  grunt.registerTask('build', ['shell:build']);
  grunt.registerTask('dev', ['shell:build', 'watch']);
};
