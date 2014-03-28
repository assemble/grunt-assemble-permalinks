/*
 * permalinks plugin for Assemble <https://github.com/assemble/permalinks>
 *
 * Copyright (c) 2014 Jon Schlinkert, Brian Woodward, contributors.
 * Licensed under the MIT license.
 */

const path  = require('path');

// node_modules
const async = require('async');
const digits = require('digits');
const strings = require('strings');
const _str = require('underscore.string');
const _ = require('lodash');
const utils  = require('./lib/utils');


/**
 * Wrapper for `strings` middleware.
 *
 * @param {Array} array of replacement patterns
 * @return {Object} return the generic key/value object
 */

function wrapper(patterns) {
  return function() {
    return _.map(patterns, function(pattern) {
      return new strings.Pattern(pattern.pattern, pattern.replacement);
    });
  };
}


/**
 * Permalinks Plugin
 * @param  {Object}   params
 * @param  {Function} callback
 * @return {String}   The permalink string
 */
module.exports = function(params, callback) {
  var assemble       = params.assemble;
  var grunt          = params.grunt;

  var options        = assemble.options.permalinks;
  var pages          = assemble.options.pages;
  var originalAssets = assemble.options.originalAssets;


  // Skip over the plugin if it isn't defined in the options.
  if(!_.isUndefined(options)) {

    var i = 0;
    var len = pages.length;

    async.forEach(pages, function(page, next) {
      i++;


      /**
       * `options.permalinks.slugify`. Slugify basenames by default.
       *
       * @type  {Boolean}
       */

      options.slugify = true;


      /**
       * The permalink structure to use. If one isn't defined
       * the dest path will not be modified.
       *
       * @type  {String}
       */

      var structure = options.structure;


      /**
       * Properties from YAML front matter
       *
       * @type  {Object}
       */

      var yfm  = page.data;


      /**
       * Omit properties from Assemble options, to prevent them
       * from poluting the context.
       *
       * @type  {Array}
       */

      var exclusions = ['_page', 'data', 'filePair', 'page', 'pageName'];
          exclusions = _.union(exclusions, options.exclusions || []);


      /**
       * `options.permalinks.slugify`. Ensure that basenames are
       * suitable to be used as URLs.
       */

      if(options.slugify) {
        if(!yfm.slug) {
          page.slug = _str.slugify(page.basename);
        }
        page.basename = _str.slugify(page.basename);
      }

      /**
       * Strip leading numbers from pages
       * Works well with `:num` pattern
       * @examples
       *   010foo.html,011bar.html => foo.html,bar.html
       */

      if(options.stripnumber === true) {
        page.basename = page.basename.replace(/^\d+\-?/, '');
      }


      // Best guesses at some useful patterns
      var specialPatterns = {
        category: new strings.Pattern(/:\bcategory\b/, _str.slugify(_.first(yfm.categories))),
        num:      new strings.Pattern(/:\bnum\b/, digits.pad(i, {auto: len})),
        digits:   new strings.Pattern(/:(0)+/, function (match) {
          var matchLen = String(match).length - 1;
          return digits.pad(i, {digits: matchLen});
        }),
        random:   new strings.Pattern(/:random\(([^)]+)\)/, function (a, b) {
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
        // special patterns
        .use(specialPatterns)

        // expose page data to Strings
        .use(page)

        // expose yfm data to Strings
        .use(yfm)

        // use the yfm.date for dates
        .use(strings.dates(yfm.date, _.pick(options, 'lang'))) // datePatterns

        // wrap middlewares
        // .use(middlewares)

        // wrap any additional patterns
        .use(wrapper(options.replacements || []))

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
       * of replacement patterns passed into options.replacements
       */
      var permalink = strings.run(structure || page.dest);

      /**
       * WRITE PERMALINKS
       * Append the permalink to the dest path defined in the target.
       */
      if(_.isUndefined(options.structure) && _.isUndefined(structure)) {
        page.dest = page.dest;
      } else {
        if (page.basename === 'index') {
          page.dest = page.dest;
        } else {
          page.dest = utils.normalizePath(path.join(page.dirname, permalink));
        }
      }

      page.assets = utils.calculatePath(page.dest, originalAssets, originalAssets);

      grunt.verbose.ok('page'.yellow, page);
      grunt.verbose.ok('page.dest'.yellow, page.dest);
      grunt.verbose.ok('page.assets'.yellow, page.assets);
      grunt.verbose.ok('Generated permalink for:'.yellow, page.dest);
      next();
    });

  } callback();
};

module.exports.options = {
  stage: 'render:pre:pages'
};