/*
 * Assemble Plugin: Permalinks
 * https://github.com/assemble/permalinks
 *
 * Copyright (c) 2013 Jon Schlinkert, contributors.
 * Licensed under the MIT license.
 */

// Node.js
var path  = require('path');

// node_modules
var chalk  = require('chalk');
var moment = require('moment');
var frep   = require('frep');



/**
 * @param  {Object}   config
 * @param  {Function} callback
 * @return {String}   The permalink string
 */
module.exports = function(config, callback) {

  'use strict';

  var context    = config.context;
  var grunt      = config.grunt;

  var permalinks = context.permalinks;
  var pages      = context.pages;
  var page       = context.page;

  var async      = grunt.util.async;
  var _          = grunt.util._;

  // Skip over the plugin if it isn't defined in the options.
  if(!_.isUndefined(permalinks)) {

    pages.forEach(function(file) {

      if (page.src !== file.src) {
        return;
      }

      // Get the permalink pattern to use from options.permalinks.structure.
      // If one isn't defined, don't change anything.
      var structure = permalinks.structure || page.dest;

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
       */
      var format = function(date) {
        return moment(yfm.date).format(date);
      };

      var datePatterns = [
        // Full date
        {pattern: ':date',      replacement: moment(yfm.date, permalinks.dateFormats || ["YYYY-MM-DD"])._i || ''},
        // Long date formats
        {pattern: ':L',         replacement: format("MM/DD/YYYY")},
        {pattern: ':1',         replacement: format("M/D/YYYY")},
        // Year (2013, 13)
        {pattern: ':year',      replacement: format("YYYY")},
        {pattern: ':YYYY',      replacement: format("YYYY")},
        {pattern: ':YY',        replacement: format("YY")},
        // Month name (January, Jan)
        {pattern: ':monthname', replacement: format("MMMM")},
        {pattern: ':MMMM',      replacement: format("MMMM")},
        {pattern: ':MMM',       replacement: format("MMM")},
        // Month number (1, 01)
        {pattern: ':month',     replacement: format("MM")},
        {pattern: ':MM',        replacement: format("MM")},
        {pattern: ':mo',        replacement: format("MM")},
        {pattern: ':M',         replacement: format("M")},
        // Day of the year
        {pattern: ':DDDD',      replacement: format("DDDD")},
        {pattern: ':DDD',       replacement: format("DDD")},
        // Day of the month
        {pattern: ':day',       replacement: format("DD")},
        {pattern: ':DD',        replacement: format("DD")},
        {pattern: ':D',         replacement: format("D")},
        // Day of the week (wednesday/wed)
        {pattern: ':dddd',      replacement: format("dddd")},
        {pattern: ':ddd',       replacement: format("ddd")},
        {pattern: ':dd',        replacement: format("dd")},
        {pattern: ':d',         replacement: format("d")},
        // Hour
        {pattern: ':hour',      replacement: format("HH")},
        {pattern: ':HH',        replacement: format("HH")},
        {pattern: ':H',         replacement: format("H")},
        {pattern: ':hh',        replacement: format("hh")},
        {pattern: ':h',         replacement: format("h")},
        // Minute
        {pattern: ':minute',    replacement: format("mm")},
        {pattern: ':min',       replacement: format("mm")},
        {pattern: ':mm',        replacement: format("mm")},
        {pattern: ':m',         replacement: format("m")},
        // Second
        {pattern: ':second',    replacement: format("ss")},
        {pattern: ':sec',       replacement: format("ss")},
        {pattern: ':ss',        replacement: format("ss")},
        {pattern: ':s',         replacement: format("s")},
        // AM/PM, am/pm
        {pattern: ':A',         replacement: format("A")},
        {pattern: ':a',         replacement: format("a")},
        {pattern: ':P',         replacement: format("P")},
        {pattern: ':p',         replacement: format("p")},
      ];

      // Best guesses at some useful patterns
      var specialPatterns = [
        {pattern: ':category',  replacement: _.slugify(_.first(yfm.categories))}
      ];

      // Push properties on the `page` object into the "props" array
      // so we can use them to dynamically construct replacement patterns
      _.keys(_.omit(page, exclusions)).map(function(key) {
        props.push({pattern: ':' + key, replacement: page[key]});
      });

      // Push properties on the `page.data` object into the "props" array
      // so we can use them to dynamically construct replacement patterns
      _.keys(_.omit(yfm, exclusions)).map(function(key) {
        props.push({pattern: ':' + key, replacement: _.slugify(yfm[key])});
      });

      // All the replacement patterns contructed from dates, the page obj,
      // and page.data obj.
      var replacements = _.union([], props, specialPatterns, permalinks.patterns || [], datePatterns);

      /**
       * PRESETS
       * Pre-formatted permalink structures. If a preset is defined, append
       * it to the user-defined structure.
       */
      if(permalinks.preset && String(permalinks.preset).length !== 0) {
        var presets = {
          pretty: path.join((structure || ''), _.slugify(page.basename), 'index.html')
        };
        structure = String(_.values(_.pick(presets, permalinks.preset)));
      }
      config.grunt.verbose.writeln(chalk.bold('permalinks.structure'), structure);


      /**
       * CREATE PERMALINKS
       * Construct the permalink string.
       */
      var permalink = frep.strWithArr(structure || page.dest, replacements);


      /**
       * WRITE PERMALINKS
       * Append the permalink to the dest path defined in the target.
       */
      file.dest = path.join(page.dirname, permalink);
    });

  } callback();
};
