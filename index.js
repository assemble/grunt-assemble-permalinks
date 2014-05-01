/**
 * Copyright (c) 2014 Jon Schlinkert, Brian Woodward, contributors.
 * Licensed under the MIT License (MIT).
 */

// Node.js
var path  = require('path');

// node_modules
var async = require('async');
var permalinks = require('permalinks');
var calculatePath = require('calculate-assets');
var _str = require('underscore.string');
var _ = require('lodash');

/**
 * Permalinks Plugin
 * @param  {Object}   params
 * @param  {Function} done
 * @return {String}   The permalink string
 */

module.exports = function (assemble) {

  var plugin = function(params, done) {

    var grunt          = assemble.config.grunt;
    var options        = assemble.config.permalinks;
    var originalAssets = assemble.config.assets;
    var pages          = assemble.pages;

    // Skip over the plugin if it isn't defined in the options.
    if(!_.isUndefined(options)) {

      var pageKeys = _.keys(pages);
      options.index = 0;
      options.length = pageKeys.length;

      async.forEach(pageKeys, function(pageKey, next) {

        var page = pages[pageKey];
        options.index++;

        // Slugify basenames by default.
        options.slugify = true;

        // Get the permalink pattern to use from options.permalinks.structure.
        // If one isn't defined, don't change anything.
        var structure = options.structure;

        // Convenience variable for YAML front matter.
        var yfm  = page.data;

        // exclusion patterns option. properties to omit from the params object.
        var exclusions = ['_page', 'data', 'filePair', 'page', 'pageName'];
            exclusions = _.union([], exclusions, options.exclusions || []);


        // `slugify` option. Ensure that basenames are suitable to be used as URLs.
        if(options.slugify) {
          if(!yfm.slug) {
            page.data.slug = _str.slugify(page.data.basename);
          }
          page.data.basename = _str.slugify(page.data.basename);
        }

        /**
         * Strip leading numbers from pages
         * Works well with `:num` pattern
         * @examples
         *   010foo.html,011bar.html => foo.html,bar.html
         */

        if(options.stripnumber === true) {
          page.data.basename = page.data.basename.replace(/^\d+\-?/, '');
        }


        var context = _.extend({}, yfm, page);
        context = _.omit(context, exclusions);

        /**
         * CREATE PERMALINKS
         * Construct the permalink string. Modifies string with an array
         * of replacement patterns passed into options.patterns
         */

        var permalink = permalinks(structure, context, options);

        /**
         * WRITE PERMALINKS
         * Append the permalink to the dest path defined in the target.
         */

        if(_.isUndefined(options.structure) && _.isEmpty(permalink)) {
          page.data.dest = page.dest = page.data.dest || page.dest;
        } else {
          if (page.data.basename === 'index') {
            page.data.dest = page.dest = page.data.dest || page.dest;
          } else {
            page.data.dest = page.dest = path.join(page.data.dirname, permalink).replace(/\\/g, '/');
          }
        }
        page.data.assets = calculatePath(page.data.dest, originalAssets);

        grunt.verbose.ok('page'.yellow, page);
        grunt.verbose.ok('page.data.dest'.yellow, page.data.dest);
        grunt.verbose.ok('page.data.assets'.yellow, page.data.assets);
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

