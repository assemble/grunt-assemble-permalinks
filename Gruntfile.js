/*
 * Assemble Plugin: Permalinks
 * https://github.com/assemble/permalinks
 *
 * Copyright (c) 2013 Jon Schlinkert, contributors
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),

    jshint: {
      options: {
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        boss: true,
        eqnull: true,
        node: true
      },
      all: ['Gruntfile.js', 'tasks/*.js', '<%= nodeunit.tests %>']
    },

    assemble: {
      options: {
        plugins: ['./permalinks.js'],
        helpers: ['test/fixtures/helpers/*.js'],
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
            patterns: [
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
            patterns: [
              {
                pattern: ':tag',
                replacement: function (src) {
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
      }
    },

    /**
     * Pull down a list of repos from Github.
     * (bundled with the readme task)
     */
    repos: {
      assemble: {
        options: {
          username: 'assemble',
          include: ['contrib'],
          exclude: ['example', 'permalinks', 'rss']
        },
        files: {
          'docs/repos.json': ['repos?page=1&per_page=100']
        }
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

    /**
     * Extend context for templates
     * with repos.json
     */
    readme: {
      options: {
        metadata: ['docs/repos.json']
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
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-prettify');
  grunt.loadNpmTasks('grunt-readme');
  grunt.loadNpmTasks('grunt-repos');
  grunt.loadNpmTasks('assemble');

  // By default, lint and run all tests.
  grunt.registerTask('default', [
    'jshint',
    'clean',
    'assemble',
    'prettify',
    'readme'
  ]);
};
