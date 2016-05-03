/*
 After you have changed the settings under responsive_images
 run this with one of these options:
  "grunt" alone creates a new, completed images directory
  "grunt clean" removes the images directory
  "grunt responsive_images" re-processes images without removing the old ones
*/

module.exports = function(grunt) {

  grunt.initConfig({

    uglify: {
      options: {
        mangle: false
      },
      my_target: {
        files: {
          '../dist/js/app.min.js': ['./js/app.js'],
          '../dist/js/jquery.watermark.min.js': ['./js/jquery.watermark.js'],
        }
      }
    },

    cssmin: {
      target: {
        files: [{
          expand: true,
          src: ['./css/*.css','./views/css/*.css',],
          dest: '../dist/',
          ext: '.min.css'
        }],
      }
    },

    copy: {
      main: {
        files: [{
          expand: true,
          src: ['./images','./js/*.min.js','./js/scripts/**'],
          dest: '../dist/',
          dot: true
        }],
      }
    },

    htmlcompressor: {
      compile: {
        files: {
          '../dist/index.html': 'index.html',
        },
        options : {
          type: 'html',
        }
      }
    },

    /* Clear out the images directory if it exists */
    clean: {
      dev: {
        src: ['img'],
      },
    },

    /* Generate the images directory if it is missing */
    mkdir: {
      dev: {
        options: {
          create: ['img']
        },
      },
    },

  });

  grunt.loadNpmTasks('grunt-responsive-images');
  grunt.loadNpmTasks('grunt-htmlcompressor');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-mkdir');
  grunt.registerTask('default', ['mkdir','uglify','cssmin','copy','htmlcompressor']);

};
