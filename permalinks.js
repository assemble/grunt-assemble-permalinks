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
var moment = require('moment');
var frep   = require('frep');



/**
 * @param  {Object}   config
 * @param  {Function} callback
 * @return {String}   The permalink string
 */
var permalinks = function(config, callback) {

  'use strict';

  var _          = config.grunt.util._;
  var pages      = config.context.pages;
  var permalinks = config.context.permalinks;

  // Skip over the plugin if it isn't defined in the optiosn.
  if(!_.isUndefined(permalinks)) {

    // Get the permalink pattern to use from the
    // Assemble options (options.permalinks.pattern)
    var structure = permalinks.structure;

    pages.map(function(page) {

      // Create a placeholder for page properties.
      var props = [];

      // Properties to omit from the config object.
      var exclusions = ['_page', 'data', 'filePair', 'page', 'pageName'];
          exclusions = _.union([], exclusions, permalinks.exclusions || []);

      // Convenience variable for YAML front matter.
      var yfm  = page.data;

      // Set the default language.
      moment.lang(permalinks.lang || 'en');

      // Replacement patterns
      var datePatterns = [
        // Full date
        {pattern: ':date',      replacement: moment(yfm.date, permalinks.dateFormats || ["YYYY-MM-DD"])._i || ''},

        // Long date formats
        {pattern: ':L',         replacement: moment(yfm.date).format("MM/DD/YYYY")},
        {pattern: ':1',         replacement: moment(yfm.date).format("M/D/YYYY")},

        // Year (2013, 13)
        {pattern: ':year',      replacement: moment(yfm.date).format("YYYY")},
        {pattern: ':YYYY',      replacement: moment(yfm.date).format("YYYY")},
        {pattern: ':YY',        replacement: moment(yfm.date).format("YY")},
        // Month name (January, Jan)
        {pattern: ':monthname', replacement: moment(yfm.date).format("MMMM")},
        {pattern: ':MMMM',      replacement: moment(yfm.date).format("MMMM")},
        {pattern: ':MMM',       replacement: moment(yfm.date).format("MMM")},
        // Month number (1, 01)
        {pattern: ':month',     replacement: moment(yfm.date).format("MM")},
        {pattern: ':MM',        replacement: moment(yfm.date).format("MM")},
        {pattern: ':mo',        replacement: moment(yfm.date).format("MM")},
        {pattern: ':M',         replacement: moment(yfm.date).format("M")},
        // Day of the year
        {pattern: ':DDDD',      replacement: moment(yfm.date).format("DDDD")},
        {pattern: ':DDD',       replacement: moment(yfm.date).format("DDD")},
        // Day of the month
        {pattern: ':day',       replacement: moment(yfm.date).format("DD")},
        {pattern: ':DD',        replacement: moment(yfm.date).format("DD")},
        {pattern: ':D',         replacement: moment(yfm.date).format("D")},
        // Day of the week (wednesday/wed)
        {pattern: ':dddd',      replacement: moment(yfm.date).format("dddd")},
        {pattern: ':ddd',       replacement: moment(yfm.date).format("ddd")},
        {pattern: ':dd',        replacement: moment(yfm.date).format("dd")},
        {pattern: ':d',         replacement: moment(yfm.date).format("d")},
        // Hour
        {pattern: ':hour',      replacement: moment(yfm.date).format("HH")},
        {pattern: ':HH',        replacement: moment(yfm.date).format("HH")},
        {pattern: ':H',         replacement: moment(yfm.date).format("H")},
        {pattern: ':hh',        replacement: moment(yfm.date).format("hh")},
        {pattern: ':h',         replacement: moment(yfm.date).format("h")},
        // Minute
        {pattern: ':minute',    replacement: moment(yfm.date).format("mm")},
        {pattern: ':min',       replacement: moment(yfm.date).format("mm")},
        {pattern: ':mm',        replacement: moment(yfm.date).format("mm")},
        {pattern: ':m',         replacement: moment(yfm.date).format("m")},
        // Second
        {pattern: ':second',    replacement: moment(yfm.date).format("ss")},
        {pattern: ':sec',       replacement: moment(yfm.date).format("ss")},
        {pattern: ':ss',        replacement: moment(yfm.date).format("ss")},
        {pattern: ':s',         replacement: moment(yfm.date).format("s")},
        // AM/PM, am/pm
        {pattern: ':A',         replacement: moment(yfm.date).format("A")},
        {pattern: ':a',         replacement: moment(yfm.date).format("a")},
        {pattern: ':P',         replacement: moment(yfm.date).format("P")},
        {pattern: ':p',         replacement: moment(yfm.date).format("p")},
      ];


      // Best guesses at some useful patterns
      var specialPatterns = [
        {pattern: ':category',  replacement: _.slugify(_.first(yfm.categories))}
      ];


      // Dynamically construct replacement patterns from properties on the
      // `page` object, and push them into the "props" array.
      _.keys(_.omit(page, exclusions)).map(function(key) {
        props.push({pattern: ':' + key, replacement: page[key]});
      });


      // Dynamically construct replacement patterns from properties on the
      // `page.data` object, and push them into the "props" array.
      _.keys(_.omit(yfm, exclusions)).map(function(key) {
        props.push({pattern: ':' + key, replacement: _.slugify(yfm[key])});
      });


      // All the replacement patterns contructed from dates, the page obj, and page.data obj.
      var replacements = _.union([], props || [], specialPatterns || [], permalinks.patterns || [], datePatterns || []);


      // Construct the permalink string.
      var permalink = frep.strWithArr(structure, replacements);


      // Append the permalink to the dest path defined in the target.
      page.dest = path.join(page.dirname, permalink);
    });
  }
  callback();
};


module.exports = permalinks;
