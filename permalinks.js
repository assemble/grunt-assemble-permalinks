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
var moment = require('moment');
var frep   = require('frep');

// Local utils
var Utils  = require('./lib/utils');



/**
 * Permalinks Plugin
 * @param  {Object}   params
 * @param  {Function} callback
 * @return {String}   The permalink string
 */
module.exports = function(params, callback) {

  'use strict';

  var context        = params.context;
  var assemble       = params.assemble;
  var grunt          = params.grunt;

  var permalinks     = context.permalinks;
  var pages          = context.pages;
  var page           = context.page;
  var originalAssets = context.originalAssets;

  var async          = grunt.util.async;
  var _str           = grunt.util._.str;
  var _              = grunt.util._;


  // console.log(assemble.options.pages);
  // grunt.file.write('pages.json', JSON.stringify(assemble.options.pages, null, 2));

  // Skip over the plugin if it isn't defined in the options.
  if(!_.isUndefined(permalinks)) {

    async.forEach(pages, function(file, next) {
      if (page.src !== file.src) {
        return;
      }

      // Slugify basenames by default.
      permalinks.slugify = true;


      // Get the permalink pattern to use from options.permalinks.structure.
      // If one isn't defined, don't change anything.
      var structure = permalinks.structure;

      // Create a placeholder for page properties.
      var props = [];

      // Convenience variable for YAML front matter.
      var yfm  = file.data;


      /**
       * EXCLUSION PATTERNS OPTION
       * Properties to omit from the params object.
       */
      var exclusions = ['_page', 'data', 'filePair', 'page', 'pageName'];
          exclusions = _.union([], exclusions, permalinks.exclusions || []);


      /**
       * LANGUAGE OPTION
       * Set the default language.
       */
      moment.lang(permalinks.lang || 'en');

      var format = function(d) {
        return moment(yfm.date).format(d);
      };


      /**
       * REPLACEMENT PATTERNS
       * Replacement variables for permalink structure.
       * Format the date from the YAML front matter of a page.
       */
      var datePatterns = [
        // Full date
        {pattern: /:\bdate\b/,      replacement: format(permalinks.dateFormats || "YYYY/MM/DD")},
        // Long date formats
        {pattern: /:\bL\b/,         replacement: format("MM/DD/YYYY")},
        {pattern: /:\b1\b/,         replacement: format("M/D/YYYY")},
        // Year (2013, 13)
        {pattern: /:\byear\b/,      replacement: format("YYYY")},
        {pattern: /:\bYYYY\b/,      replacement: format("YYYY")},
        {pattern: /:\bYY\b/,        replacement: format("YY")},
        // Month name (January, Jan)
        {pattern: /:\bmonthname\b/, replacement: format("MMMM")},
        {pattern: /:\bMMMM\b/,      replacement: format("MMMM")},
        {pattern: /:\bMMM\b/,       replacement: format("MMM")},
        // Month number (1, 01)
        {pattern: /:\bmonth\b/,     replacement: format("MM")},
        {pattern: /:\bMM\b/,        replacement: format("MM")},
        {pattern: /:\bmo\b/,        replacement: format("MM")},
        {pattern: /:\bM\b/,         replacement: format("M")},
        // Day of the year
        {pattern: /:\bDDDD\b/,      replacement: format("DDDD")},
        {pattern: /:\bDDD\b/,       replacement: format("DDD")},
        // Day of the month
        {pattern: /:\bday\b/,       replacement: format("DD")},
        {pattern: /:\bDD\b/,        replacement: format("DD")},
        {pattern: /:\bD\b/,         replacement: format("D")},
        // Day of the week (wednesday/wed)
        {pattern: /:\bdddd\b/,      replacement: format("dddd")},
        {pattern: /:\bddd\b/,       replacement: format("ddd")},
        {pattern: /:\bdd\b/,        replacement: format("dd")},
        {pattern: /:\bd\b/,         replacement: format("d")},
        // Hour
        {pattern: /:\bhour\b/,      replacement: format("HH")},
        {pattern: /:\bHH\b/,        replacement: format("HH")},
        {pattern: /:\bH\b/,         replacement: format("H")},
        {pattern: /:\bhh\b/,        replacement: format("hh")},
        {pattern: /:\bh\b/,         replacement: format("h")},
        // Minute
        {pattern: /:\bminute\b/,    replacement: format("mm")},
        {pattern: /:\bmin\b/,       replacement: format("mm")},
        {pattern: /:\bmm\b/,        replacement: format("mm")},
        {pattern: /:\bm\b/,         replacement: format("m")},
        // Second
        {pattern: /:\bsecond\b/,    replacement: format("ss")},
        {pattern: /:\bsec\b/,       replacement: format("ss")},
        {pattern: /:\bss\b/,        replacement: format("ss")},
        {pattern: /:\bs\b/,         replacement: format("s")},
        // AM/PM, am/pm
        {pattern: /:\bA\b/,         replacement: format("A")},
        {pattern: /:\ba\b/,         replacement: format("a")},
        {pattern: /:\bP\b/,         replacement: format("P")},
        {pattern: /:\bp\b/,         replacement: format("p")},
      ];


      /**
       * `slugify` option
       * Ensure that basenames are suitable to be used as URLs.
       */
      if(permalinks.slugify) {
        if(!page.slug) {
          page.slug = _str.slugify(file.basename);
        }
        page.basename = _str.slugify(page.basename);
      }


      // Best guesses at some useful patterns
      var specialPatterns = [
        {pattern: /:\bcategory\b/,  replacement: _str.slugify(_.first(yfm.categories))}
      ];

      // Push properties on the `page` object into the "props" array
      // so we can use them to dynamically construct replacement patterns
      _.keys(_.omit(page, exclusions)).map(function(key) {
        props.push({pattern: new RegExp(':\\b' + key + '\\b'), replacement: page[key]});
      });

      // Push properties on the `page.data` object into the "props" array
      // so we can use them to dynamically construct replacement patterns
      _.keys(_.omit(yfm, exclusions)).map(function(key) {
        props.push({pattern: new RegExp(':\\b' + key + '\\b'), replacement: _str.slugify(yfm[key])});
      });



      // All the replacement patterns contructed from dates, the page obj,
      // and page.data obj.
      var replacements = _.union([], permalinks.patterns || [], datePatterns, props, specialPatterns);


      /**
       * PRESETS
       * Pre-formatted permalink structures. If a preset is defined, append
       * it to the user-defined structure.
       */
      if(permalinks.preset && String(permalinks.preset).length !== 0) {

        // The preset
        var presets = {
          pretty:    path.join((structure || ''), ':basename/index:ext'),
          dayname:   path.join((structure || ''), ':YYYY/:MM/:DD/:basename/index:ext'),
          monthname: path.join((structure || ''), ':YYYY/:MM/:basename/index:ext')
        };
        // Presets are joined to structures, so if a preset is specified, use it.
        structure = String(_.values(_.pick(presets, permalinks.preset)));
      }


      /**
       * CREATE PERMALINKS
       * Construct the permalink string.
       */
      var permalink = frep.strWithArr(structure || page.dest, replacements);



      /**
       * WRITE PERMALINKS
       * Append the permalink to the dest path defined in the target.
       */
      if(_.isUndefined(permalinks.structure) && _.isUndefined(permalinks.preset)) {
        page.dest = page.dest;
        file.dest = file.dest;
      } else {
        if (file.basename === 'index') {
          page.dest = page.dest;
          file.dest = file.dest;
        } else {
          file.dest = Utils.normalizePath(path.join(file.dirname, permalink));
          page.dest = Utils.normalizePath(path.join(page.dirname, permalink));
        }
      }
      file.assets = Utils.calculateAssetsPath(file.dest, originalAssets);
      page.assets = Utils.calculateAssetsPath(page.dest, originalAssets);
      params.context.assets = page.assets;

      grunt.verbose.ok('page'.yellow, page);
      grunt.verbose.ok('page.dest'.yellow, page.dest);
      grunt.verbose.ok('page.assets'.yellow, page.assets);

      grunt.verbose.ok('Generated permalink to:'.yellow, file.dest);
      next();
    });

  } callback();
};
