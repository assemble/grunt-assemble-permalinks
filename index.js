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
 * Permalinks Middleware
 * @param  {Object}   params
 * @param  {Function} next
 * @return {String}   The permalink string
 */

module.exports = function (assemble) {

  var middleware = function(params, next) {

    var originalAssets = assemble.config.assets;
    var pages          = assemble.pages;

    var pageKeys = _.keys(pages);
    var index = 0;
    var totalPages = pageKeys.length;

    async.forEach(pageKeys, function(pageKey, nextPage) {

      var page = pages[pageKey];
      var opts = assemble.config.permalinks || page.data.permalinks;
      if (_.isUndefined(opts)) {
        return nextPage();
      }
      index++;

      opts.index = index;
      opts.length = totalPages;

      // Slugify basenames by default.
      opts.slugify = true;

      // Get the permalink pattern to use from options.permalinks.structure.
      // If one isn't defined, don't change anything.
      var structure = opts.structure;

      // Convenience variable for YAML front matter.
      var yfm  = page.data;

      // exclusion patterns option. properties to omit from the params object.
      var exclusions = ['_page', 'data', 'filePair', 'page', 'pageName'];
          exclusions = _.union([], exclusions, opts.exclusions || []);


      // `slugify` option. Ensure that basenames are suitable to be used as URLs.
      if(opts.slugify) {
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

      if(opts.stripnumber === true) {
        page.data.basename = page.data.basename.replace(/^\d+\-?/, '');
      }


      var context = _.extend({}, yfm, page);
      context = _.omit(context, exclusions);

      /**
       * CREATE PERMALINKS
       * Construct the permalink string. Modifies string with an array
       * of replacement patterns passed into options.patterns
       */

      var permalink = permalinks(structure, context, opts);

      /**
       * WRITE PERMALINKS
       * Append the permalink to the dest path defined in the target.
       */

      if(_.isUndefined(opts.structure) && _.isEmpty(permalink)) {
        page.data.dest = page.dest = page.data.dest || page.dest;
      } else {
        if (page.data.basename === 'index') {
          page.data.dest = page.dest = page.data.dest || page.dest;
        } else {
          page.data.dest = page.dest = path.join(page.data.dirname, permalink).replace(/\\/g, '/');
        }
      }
      page.data.assets = calculatePath(page.data.dest, originalAssets);

      assemble.log.verbose('page'.yellow, page);
      assemble.log.verbose('page.data.dest'.yellow, page.data.dest);
      assemble.log.verbose('page.data.assets'.yellow, page.data.assets);
      nextPage();
    },
    next);
  };

  middleware.event = 'assemble:before:render';
  return {
    'assemble-middleware-permalinks': middleware
  };
};

