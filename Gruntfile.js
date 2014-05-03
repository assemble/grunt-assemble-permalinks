/*
 * assemble-plugin-permalinks <https://github.com/assemble/permalinks>
 *
 * Copyright (c) 2014 Jon Schlinkert, Brian Woodward, contributors
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  // For task assemble:filename_replacement
  var toPost = function(str) {
    var path = require('path');
    var name = path.basename(str, path.extname(str));
    var re = /(\d{4})-(\d{2})-(\d{2})-(.+)/;
    // $1 = yyyy, $2 = mm, $3 = dd, $4 = basename
    return name.replace(re, '$4');
  };

  // Project configuration.
  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),

    jshint: {
      all: ['Gruntfile.js', 'test/**/*.js'],
      options: {
        jshintrc: '.jshintrc',
      }
    },

    assemble: {
      options: {
        collections: [
          {
            name: 'tag',
            plural: 'tags'
          },
          {
            name: 'category',
            plural: 'categories'
          }
        ],
        plugins: ['index.js'],
        helpers: [
          'handlebars-helper-eachItems',
          'handlebars-helper-paginate',
          'test/fixtures/helpers/*.js'
        ],
        layout: 'test/fixtures/default.hbs',
        data: 'test/fixtures/ipsum.json',
        assets: 'test/assets'
      },
      // Should not modify dest path. Files array format.
      no_opts_files: {
        options: {
          permalinks: {}
        },
        files: [
          {expand: true, cwd: 'test/fixtures/pages', src: ['**/*.hbs'], dest: 'test/actual/no_opts_files/', ext: '.html'}
        ]
      },
      // Should not modify dest path.
      // Note that when multiple files exist with the same basename, flattening will
      // eliminate all but on of those files. This is an expected result, not a bug.
      no_opts_flatten: {
        options: {
          ext: '.html',
          flatten: true,
          permalinks: {}
        },
        src: 'test/fixtures/pages/**/*.hbs',
        dest: 'test/actual/no_opts_flatten/'
      },
      // Should flatten, then use 'dest + permalinks structure + permalinks preset' for dest
      preset_flatten: {
        options: {
          ext: '.html',
          flatten: true,
          permalinks: {
            preset: 'pretty',
            structure: ':section'
          }
        },
        src: 'test/fixtures/pages/**/*.hbs',
        dest: 'test/actual/preset_flatten/'
      },
      // Should add a unique number to each file name, and numbers should be padded with
      // the specified number of digits
      digits_specified: {
        options: {
          permalinks: {
            structure: ':section/:basename-:0000:ext'
          }
        },
        files: [
          {expand: true, cwd: 'test/fixtures/pages', src: ['**/*.hbs'], dest: 'test/actual/digits_specified/', ext: '.html'}
        ]
      },
      // Should add a unique number to each file name
      digits_auto: {
        options: {
          permalinks: {
            structure: ':section/:basename-:num:ext'
          }
        },
        files: [
          {expand: true, cwd: 'test/fixtures/pages', src: ['**/*.hbs'], dest: 'test/actual/digits_auto/', ext: '.html'}
        ]
      },
      // Should add a unique number to each file name
      random: {
        options: {
          permalinks: {
            structure: ':section/:random(0Aa,9)-:basename:ext'
          }
        },
        files: [
          {expand: true, cwd: 'test/fixtures/pages', src: ['**/*.hbs'], dest: 'test/actual/random/', ext: '.html'}
        ]
      },
      // Should modify dest path using preset "pretty"
      preset_pretty: {
        options: {
          permalinks: {
            preset: 'pretty'
          }
        },
        files: [
          {expand: true, cwd: 'test/fixtures/pages', src: ['**/*.hbs'], dest: 'test/actual/preset_pretty/', ext: '.html'}
        ]
      },
      // Should modify dest path using preset "dayname"
      preset_dayname: {
        options: {
          permalinks: {
            preset: 'dayname'
          }
        },
        files: [
          {expand: true, cwd: 'test/fixtures/pages', src: ['**/*.hbs'], dest: 'test/actual/preset_dayname/', ext: '.html'}
        ]
      },
      // Should modify dest path using preset "monthname"
      preset_monthname: {
        options: {
          permalinks: {
            preset: 'monthname'
          }
        },
        files: [
          {expand: true, cwd: 'test/fixtures/pages', src: ['**/*.hbs'], dest: 'test/actual/preset_monthname/', ext: '.html'}
        ]
      },
      // Should modify dest path using permalinks structure
      structure_basename: {
        options: {
          permalinks: {
            structure: ':basename:ext'
          }
        },
        files: [
          {expand: true, cwd: 'test/fixtures/pages', src: ['**/*.hbs'], dest: 'test/actual/structure_basename/', ext: '.html'}
        ]
      },
      // Should use a long date format for the path
      dates: {
        options: {
          permalinks: {
            structure: ':YYYY/:MM/:DD/:basename/index:ext'
          }
        },
        files: [
          {expand: true, cwd: 'test/fixtures/pages', src: ['**/*.hbs'], dest: 'test/actual/dates/', ext: '.html'}
        ]
      },
      // Date patterns should not collide with non-date patterns
      date_collision: {
        options: {
          permalinks: {
            structure: ':YYYY/:MM/:DD/:basename/index:ext'
          }
        },
        files: [
          {expand: true, cwd: 'test/fixtures/pages', src: ['**/*.hbs'], dest: 'test/actual/date_collision/', ext: '.html'}
        ]
      },
      // Should modify dest path using permalinks structure
      structure_date: {
        options: {
          permalinks: {
            structure: ':date/index:ext'
          }
        },
        files: [
          {expand: true, cwd: 'test/fixtures/pages', src: ['**/*.hbs'], dest: 'test/actual/structure_date/', ext: '.html'}
        ]
      },
      // Should modify dest path using a built-in property from context
      builtin_property_from_context: {
        options: {
          permalinks: {
            // 'basename' is a property on the root context
            structure: ':basename/index:ext'
          }
        },
        files: [
          {expand: true, cwd: 'test/fixtures/pages', src: ['**/*.hbs'], dest: 'test/actual/built_in_property/', ext: '.html'}
        ]
      },
      // Should not add basename to index
      index_pages: {
        options: {
          permalinks: {
            structure: ':basename/index:ext'
          }
        },
        files: [
          {expand: true, cwd: 'test/fixtures/pages', src: ['**/*.hbs'], dest: 'test/actual/index_pages/', ext: '.html'}
        ]
      },
      // Should properly calculate dest path for collections
      collections_pretty: {
        options: {
          permalinks: {
            preset: 'pretty'
          }
        },
        files: [
          {expand: true, cwd: 'test/fixtures/pages', src: ['**/*.hbs'], dest: 'test/actual/collections_pretty/', ext: '.html'}
        ]
      },
      // Should properly calculate dest path for collections
      collections_complex: {
        options: {
          permalinks: {
            preset: 'pretty',
            structure: ':YYYY/:MM/:DD'
          }
        },
        files: [
          {expand: true, cwd: 'test/fixtures/pages', src: ['**/*.hbs'], dest: 'test/actual/collections_complex/', ext: '.html'}
        ]
      },
      // Should modify dest path using a custom property from YAML front matter
      yfm_custom_property: {
        options: {
          permalinks: {
            // 'slug' is a custom property in YAML front matter
            structure: ':slug/index:ext'
          }
        },
        files: [
          {expand: true, cwd: 'test/fixtures/pages', src: ['**/*.hbs'], dest: 'test/actual/yfm_custom_property/', ext: '.html'}
        ]
      },
      // Should modify dest path using a custom property from YAML front matter
      assets_path: {
        options: {
          permalinks: {
            // 'slug' is a custom property in YAML front matter
            structure: ':slug/index:ext'
          }
        },
        files: [
          {expand: true, cwd: 'test/fixtures/pages', src: ['**/*.hbs'], dest: 'test/actual/yfm_custom_property/', ext: '.html'}
        ]
      },
      // Should modify dest path using a custom replacement pattern
      custom_replacement_pattern: {
        options: {
          permalinks: {
            preset: 'pretty',
            structure: ':project/:author',
            replacements: [
              {
                // should be "assemble-contrib-permalinks"
                pattern: ':project',
                replacement: '<%= pkg.name %>'
              },
              {
                // should be "jon-schlinkert"
                pattern: ':author',
                replacement: '<%= _.slugify(pkg.author.name) %>'
              }
            ]
          }
        },
        files: [
          {expand: true, cwd: 'test/fixtures/pages', src: ['**/*.hbs'], dest: 'test/actual/replacement_pattern/', ext: '.html'}
        ]
      },
      // Should modify dest path using a custom replacement function
      custom_replacement_function: {
        options: {
          permalinks: {
            structure: ':tag/:basename.html',
            replacements: [
              {
                pattern: ':tag',
                replacement: function () {
                  return this.tags ? this.tags[0] : 'default';
                }
              }
            ]
          }
        },
        files: [
          {expand: true, cwd: 'test/fixtures/pages', src: ['**/*.hbs'], dest: 'test/actual/replacement_function/', ext: '.html'}
        ]
      },
      // Should modify dest path using a filename replacement function
      filename_replacement: {
        options: {
          permalinks: {
            structure: ':post/index.html',
            replacements: [
              {
                pattern: ':post',
                replacement: function() {
                  return toPost(this.src);
                }
              }
            ]
          }
        },
        files: [
          {expand: true, cwd: 'test/fixtures/posts', src: ['**/*.md'], dest: 'test/actual/filename_replacement/', ext: '.html'}
        ]
      },
      // Should generate a javascript file with all non-function replacement patterns
      debug_option: {
        options: {
          permalinks: {
            debug: 'test/actual/replacements.js',
            preset: 'pretty',
            structure: ':YYYY/:MM/:DD'
          }
        },
        files: [
          {expand: true, cwd: 'test/fixtures/pages', src: ['**/*.hbs'], dest: 'test/actual/collections_complex/', ext: '.html'}
        ]
      },
      // Should modify dest path using permalink options from the page yfm
      yfm_permalinks: {
        options: {
        },
        files: [
          {expand: true, cwd: 'test/fixtures/yfm-pages', src: ['**/*.hbs'], dest: 'test/actual/yfm_permalinks/', ext: '.html'}
        ]
      }
    },

    /**
     * Beautify generated HTML for easier diffs
     */
    prettify: {
      defaults: {
        options: {
          padcomments: 1,
          sanitize: true,
          ocd: true
        },
        files: [
          {expand: true, cwd: 'test/actual', src: ['**/*.html'], dest: 'test/actual/', ext: '.html'}
        ]
      }
    },

    // Before generating new files, remove any files from previous build.
    clean: {
      actual: ['test/actual/**'],
    },

    // Unit tests.
    nodeunit: {
      tests: ['test/*_test.js'],
    }
  });

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-assemble');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-prettify');
  grunt.loadNpmTasks('grunt-verb');

  // By default, lint and run all tests.
  grunt.registerTask('default', [
    'jshint',
    'clean',
    'assemble',
    'prettify',
    'verb'
  ]);
};
