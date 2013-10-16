/*
 * Assemble Plugin: Permalinks
 * https://github.com/assemble/permalinks
 *
 * Assemble is the 100% JavaScript static site generator for Node.js, Grunt.js, and Yeoman.
 * Copyright (c) 2013 Jon Schlinkert, contributors.
 * Licensed under the MIT license.
 */

// Node.js
var path  = require('path');

// node_modules
var moment = require('moment');
var frep   = require('frep');


/**
 * @param  {Object}   config
 * @param  {Function} callback
 * @return {String}   The permalink string
 */
module.exports = function(config, callback) {

  'use strict';

  var context        = config.context;
  var grunt          = config.grunt;
  
  var permalinks     = context.permalinks;
  var pages          = context.pages;
  var page           = context.page;
  var originalAssets = context.originalAssets;
  
  var async          = grunt.util.async;
  var _              = grunt.util._;


  var normalizePath = function(str) {
    return str.replace(/\\/g, '/');
  };

  var calculateAssetsPath = function(dest, assets) {


    var newAssets = assets;
    var destDirname = path.dirname(dest);

    newAssets = normalizePath(path.relative(path.resolve(destDirname), path.resolve(newAssets)));

    if(!newAssets || newAssets.length === 0) {
      if(_.str.endsWith(path.normalize(newAssets), path.sep)) {
        newAssets = './';
      } else {
        newAssets = '.';
      }
    }

    if(_.str.endsWith(path.normalize(originalAssets), path.sep) &&
      !_.str.endsWith(path.normalize(newAssets), path.sep))
    {

      newAssets += '/';

    } else if (!_.str.endsWith(path.normalize(originalAssets), path.sep) &&
                _.str.endsWith(path.normalize(newAssets), path.sep)) {

      newAssets = newAssets.substring(0, newAssets.length - 2);

    }

    return newAssets;
  };


  // Skip over the plugin if it isn't defined in the options.
  if(!_.isUndefined(permalinks)) {

    pages.forEach(function(file) {

      if (page.src !== file.src) {
        return;
      }


      // Get the permalink pattern to use from options.permalinks.structure.
      // If one isn't defined, don't change anything.
      var structure = permalinks.structure;

      // Create a placeholder for page properties.
      var props = [];

      // Convenience variable for YAML front matter.
      var yfm  = page.data;


      /**
       * EXCLUSION PATTERNS OPTION
       * Properties to omit from the config object.
       */
      var exclusions = ['_page', 'data', 'filePair', 'page', 'pageName'];
          exclusions = _.union([], exclusions, permalinks.exclusions || []);


      /**
       * LANGUAGE OPTION
       * Set the default language.
       */
      moment.lang(permalinks.lang || 'en');


      /**
       * REPLACEMENT PATTERNS
       * Replacement variables for permalink structure. 
       * Fromat the date from the YAML front matter of a page.
       */
      var format = function(date) {
        return moment(yfm.date).format(date);
      };

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

      // Best guesses at some useful patterns
      var specialPatterns = [
        {pattern: /:\bcategory\b/,  replacement: _.slugify(_.first(yfm.categories))}
      ];

      // Push properties on the `page` object into the "props" array
      // so we can use them to dynamically construct replacement patterns
      _.keys(_.omit(page, exclusions)).map(function(key) {
        props.push({pattern: new RegExp(':\\b' + key + '\\b'), replacement: page[key]});
      });

      // Push properties on the `page.data` object into the "props" array
      // so we can use them to dynamically construct replacement patterns
      _.keys(_.omit(yfm, exclusions)).map(function(key) {
        props.push({pattern: new RegExp(':\\b' + key + '\\b'), replacement: _.slugify(yfm[key])});
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
          pretty: path.join((structure || ''), _.slugify(page.basename), 'index.html')
        };

        // If a preset is specified, use it.
        structure = String(_.values(_.pick(presets, permalinks.preset)));
      }


      /**
       * CREATE PERMALINKS
       * Construct the permalink string.
       */
      var permalink = frep.strWithArr(structure || page.dest, replacements);

      grunt.verbose.writeln('>> basename:'.yellow, file.basename);
      grunt.verbose.writeln('>> permalink:'.yellow, permalink);
      grunt.verbose.writeln('>> permalinks.preset:'.yellow, permalinks.preset);
      grunt.verbose.writeln('>> permalinks.structure:'.yellow, structure);


      /**
       * WRITE PERMALINKS
       * Append the permalink to the dest path defined in the target.
       */
      if(_.isUndefined(permalinks.structure) && _.isUndefined(permalinks.preset)) {
        file.dest = file.dest;
        page.dest = page.dest;
      } else {
        if (file.basename === 'index') {
          file.dest = file.dest;
          page.dest = page.dest;
        } else {
          file.dest = normalizePath(path.join(file.dirname, permalink));
          page.dest = normalizePath(path.join(page.dirname, permalink));
        }
      }

      file.assets = calculateAssetsPath(file.dest, originalAssets);
      page.assets = calculateAssetsPath(page.dest, originalAssets);
      config.context.assets = page.assets;
      grunt.verbose.ok('Generated permalink to:'.yellow, file.dest);
    });

  } callback();
};


