/*!
 * grunt-assemble-permalinks <https://github.com/assemble/grunt-assemble-permalinks>
 *
 * Copyright (c) 2014-2015, Jon Schlinkert.
 * Licensed under the MIT License.
 */
'use strict';

var path = require('path');
var each = require('async-each');
var permalinks = require('permalinks');
var calculate = require('calculate-assets');
var slugify = require('helper-slugify');
var union = require('arr-union');
var merge = require('mixin-deep');
var omit = require('object.omit');

/**
 * Permalinks Plugin
 * @param  {Object}   params
 * @param  {Function} next
 * @return {String}   The permalink string
 */

module.exports = function(params, cb) {
  var assemble = params.assemble;
  var grunt = params.grunt;

  var options = assemble.options.permalinks;
  var originalAssets = assemble.options.assets;
  var pages = assemble.options.pages;

  var index = 0;
  var totalPages = pages.length;

  each(pages, function(page, next) {
    var opts = page.data.permalinks || options;
    if (typeof opts === 'undefined') {
      next();
      return;
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
    var yfm = page.data;

    // exclusion patterns option. properties to omit from the params object.
    var exclusions = ['_page', 'data', 'filePair', 'page', 'pageName'];
    exclusions = union([], exclusions, opts.exclusions || []);

    // `slugify` option. Ensure that basenames are suitable to be used as URLs.
    if (opts.slugify) {
      page.basename = slugify(page.basename);
      if (!yfm.slug) {
        page.slug = page.basename;
      }
    }

    /**
     * Strip leading numbers from pages
     * Works well with `:num` pattern
     * @examples
     *   010foo.html,011bar.html => foo.html,bar.html
     */

    if (opts.stripnumber === true) {
      page.basename = page.basename.replace(/^\d+\-?/, '');
    }

    var context = merge({}, yfm, page);
    context = omit(context, exclusions);

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

    if (permalink && page.basename !== 'index') {
      page.dest = path.join(page.dirname, permalink).split(/\\/).join('/');
    }

    page.assets = calculate(page.dest, originalAssets);
    grunt.verbose.ok('page'.yellow, page);
    grunt.verbose.ok('page.dest'.yellow, page.dest);
    grunt.verbose.ok('page.assets'.yellow, page.assets);
    grunt.verbose.ok('Generated permalink for:'.yellow, page.dest);
    next();
  }, cb);
};

module.exports.options = {
  stage: 'render:pre:pages'
};
