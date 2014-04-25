/*
 * Assemble Plugin: Permalinks
 * https://github.com/assemble/permalinks
 * Assemble is the 100% JavaScript static site generator for Node.js, Grunt.js, and Yeoman.
 *
 * Copyright (c) 2013 Jon Schlinkert, Brian Woodward, contributors.
 * Licensed under the MIT license.
 */

// Node.js
var path  = require('path');

// node_modules
var async = require('async');
var _str = require('underscore.string');
var _ = require('lodash');
var digits = require('digits');
var strings = require('strings');

// Local utils
var utils  = require('./lib/utils');

// strings middleware wrapper to just return the generic
// key/value object
var wrapper = function(patterns) {
  return function() {
    return _.map(patterns, function(pattern) {
      return new strings.Pattern(pattern.pattern, pattern.replacement);
    });
  };
};

/**
 * Permalinks Plugin
 * @param  {Object}   params
 * @param  {Function} done
 * @return {String}   The permalink string
 */
module.exports = function (assemble) {


  var plugin = function(params, done) {

    var grunt          = assemble.options.grunt;

    var options        = assemble.options.permalinks;
    var pages          = assemble.pages;
    var originalAssets = assemble.options.assets;

    // Skip over the plugin if it isn't defined in the options.
    if(!_.isUndefined(options)) {

      var pageKeys = _.keys(pages);
      var i = 0;
      var len = pageKeys.length;

      async.forEach(pageKeys, function(pageKey, next) {

        var page = pages[pageKey];
        i++;

        // Slugify basenames by default.
        options.slugify = true;

        // Get the permalink pattern to use from options.permalinks.structure.
        // If one isn't defined, don't change anything.
        var structure = options.structure;

        // Convenience variable for YAML front matter.
        var yfm  = page.metadata;

        /**
         * EXCLUSION PATTERNS OPTION
         * Properties to omit from the params object.
         */
        var exclusions = ['_page', 'data', 'filePair', 'page', 'pageName'];
            exclusions = _.union([], exclusions, options.exclusions || []);


        /**
         * `slugify` option
         * Ensure that basenames are suitable to be used as URLs.
         */
        if(options.slugify) {
          if(!yfm.slug) {
            page.metadata.slug = _str.slugify(page.metadata.basename);
          }
          page.metadata.basename = _str.slugify(page.metadata.basename);
        }

        /**
         * Strip leading numbers from pages
         * Works well with `:num` pattern
         * @examples
         *   010foo.html,011bar.html => foo.html,bar.html
         */
        if(options.stripnumber === true) {
          page.metadata.basename = page.metadata.basename.replace(/^\d+\-?/, '');
        }


        // Best guesses at some useful patterns
        var specialPatterns = {
          'category': new strings.Pattern(/:\bcategory\b/, _str.slugify(_.first(yfm.categories))),
          'num': new strings.Pattern(/:\bnum\b/, digits.pad(i, {auto: len})),
          'digits': new strings.Pattern(/:(0)+/, function (match) {
              var matchLen = String(match).length - 1;
              return digits.pad(i, {digits: matchLen});
            }),
          'random': new strings.Pattern(/:random\(([^)]+)\)/, function (a, b) {
              var len, chars;
              if(b.match(/,/)) {
                len = parseInt(b.split(',')[1], 10);
                chars = b.split(',')[0];
                return utils.randomize(chars, len);
              } else {
                var len = b.length;
                return utils.randomize(b, len);
              }
            })
        };

        // register the replacements as middleware
        strings
          .use(specialPatterns) // specialPatterns

          // expose page data to Strings
          .use(page)

          // expose yfm data to Strings
          .use(yfm)

          // use the yfm.date for dates
          .use(strings.dates(yfm.date, _.pick(options, 'lang'))) // datePatterns

          // wrap any additional patterns
          .use(wrapper(options.patterns || []))

          // exclude some fields
          .exclude(exclusions)
        ;

        /**
         * PRESETS
         * Pre-formatted permalink structures. If a preset is defined, append
         * it to the user-defined structure.
         */

          // The preset
          var presets = {
            numbered:  path.join((structure || ''), ':num-:basename:ext'),
            pretty:    path.join((structure || ''), ':basename/index:ext'),
            dayname:   path.join((structure || ''), ':YYYY/:MM/:DD/:basename/index:ext'),
            monthname: path.join((structure || ''), ':YYYY/:MM/:basename/index:ext')
          };

        if(options.preset && String(options.preset).length !== 0) {

          // Get the specified preset
          var preset = _.values(_.pick(presets, options.preset));

          if (preset.length !== 0) {
          // Presets are joined to structures, so if a preset is specified
          // use the preset the new structure.
            structure = String(preset);
          }
        }

        // Generate a javascript file with all non-function replacement patterns
        if(options.debug) {
          if(typeof(options.debug) === 'string') {
            //grunt.file.write(options.debug, require('util').inspect(replacements));
          } else {
            throw console.error('"options.debug" must be a file path.');
          }
        }

        /**
         * CREATE PERMALINKS
         * Construct the permalink string. Modifies string with an array
         * of replacement patterns passed into options.patterns
         */
        var permalink = strings.run(structure || page.metadata.dest);

        /**
         * WRITE PERMALINKS
         * Append the permalink to the dest path defined in the target.
         */
        if(_.isUndefined(options.structure) && _.isUndefined(structure)) {
          page.metadata.dest = page.dest = page.metadata.dest || page.dest;
        } else {
          if (page.metadata.basename === 'index') {
            page.metadata.dest = page.dest = page.metadata.dest || page.dest;
          } else {
            page.metadata.dest = page.dest = utils.normalizePath(path.join(page.metadata.dirname, permalink));
          }
        }

        page.metadata.assets = utils.calculatePath(page.metadata.dest, originalAssets, originalAssets);

        grunt.verbose.ok('page'.yellow, page);
        grunt.verbose.ok('page.metadata.dest'.yellow, page.metadata.dest);
        grunt.verbose.ok('page.metadata.assets'.yellow, page.metadata.assets);
        grunt.verbose.ok('Generated permalink for:'.yellow, page.metadata.dest);
        next();
      });

    }

    done();
  };


  plugin.options = {
    name: 'assemble-contrib-permalinks',
    events: [
      'assemble:before:render'
    ]
  };

  var rtn = {};
  rtn[plugin.options.name] = plugin;
  return rtn;

};

