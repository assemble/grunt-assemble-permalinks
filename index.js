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
 * @param  {Function} next
 * @return {String}   The permalink string
 */

module.exports = function (params, next) {

  var assemble = params.assemble;
  var grunt = params.grunt;

  var options = assemble.options.permalinks;
  var originalAssets = assemble.options.assets;
  var pages          = assemble.options.pages;

  var index = 0;
  var totalPages = pages.length;

  async.forEach(pages, function(page, nextPage) {

    var opts = page.data.permalinks || options;
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

    if(opts.stripnumber === true) {
      page.basename = page.basename.replace(/^\d+\-?/, '');
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
      page.dest = page.dest;
    } else {
      if (page.basename === 'index') {
        page.dest = page.dest;
      } else {
        page.dest = page.dest = path.join(page.dirname, permalink).replace(/\\/g, '/');
      }
    }
    page.assets = calculatePath(page.dest, originalAssets);

    grunt.verbose.ok('page'.yellow, page);
    grunt.verbose.ok('page.dest'.yellow, page.dest);
    grunt.verbose.ok('page.assets'.yellow, page.assets);
    grunt.verbose.ok('Generated permalink for:'.yellow, page.dest);
    nextPage();
  },
  next);
};

module.exports.options = {
  stage: 'render:pre:pages'
};
