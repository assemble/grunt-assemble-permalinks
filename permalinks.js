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
module.exports = function(config, callback) {

  'use strict';

  var _          = config.grunt.util._;
  var pages      = config.context.pages;
  var permalinks = config.context.permalinks;


  // Skip over the plugin if it isn't defined in the optiosn.
  if(!_.isUndefined(permalinks)) {

    // Get the permalink pattern to use from the
    // Assemble options (options.permalinks.pattern)
    var pattern = permalinks.pattern;

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
        // Year
        {pattern: ':year',      replacement: moment(yfm.date).format("YYYY")},
        {pattern: ':YYYY',      replacement: moment(yfm.date).format("YYYY")},
        {pattern: ':YY',        replacement: moment(yfm.date).format("YY")},
        // Month name
        {pattern: ':monthname', replacement: moment(yfm.date).format("MMM")},
        {pattern: ':MMM',       replacement: moment(yfm.date).format("MMM")},
        // Month
        {pattern: ':month',     replacement: moment(yfm.date).format("MM")},
        {pattern: ':mo',        replacement: moment(yfm.date).format("MM")},
        {pattern: ':MM',        replacement: moment(yfm.date).format("MM")},
        // Day
        {pattern: ':dddd',       replacement: moment(yfm.date).format("dddd")},
        {pattern: ':day',       replacement: moment(yfm.date).format("DD")},
        {pattern: ':DD',        replacement: moment(yfm.date).format("DD")},
        // Hour
        {pattern: ':hour',      replacement: moment(yfm.date).format("HH")},
        {pattern: ':HH',        replacement: moment(yfm.date).format("HH")},
        // Minute
        {pattern: ':minute',    replacement: moment(yfm.date).format("mm")},
        {pattern: ':min',       replacement: moment(yfm.date).format("mm")},
        {pattern: ':mm',        replacement: moment(yfm.date).format("mm")},
        // Second
        {pattern: ':second',    replacement: moment(yfm.date).format("ss")},
        {pattern: ':sec',       replacement: moment(yfm.date).format("ss")},
        {pattern: ':ss',        replacement: moment(yfm.date).format("ss")}
      ];


      // Best guesses at some useful patterns
      var specialPatterns = [
        {pattern: ':category',  replacement: _.slugify(_.first(yfm.categories))},
        {pattern: ':name',      replacement: path.basename(page.src, path.extname(page.src))}
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
      var replacements = _.union([],
        props
        || [], datePatterns
        || [], specialPatterns
        || [], permalinks.patterns
        || []);


      // Construct the permalink string.
      var permalink = frep.strWithArr(pattern, replacements);

      // Append the permalink to the dest path defined in the target.
      page.dest = path.join(page.dirname, permalink);
    });
  }
  callback();
};


