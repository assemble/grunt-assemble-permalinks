/*
 * Assemble Plugin: Permalinks Utils
 * Assemble is the 100% JavaScript static site generator for Node.js, Grunt.js, and Yeoman.
 * https://github.com/assemble/permalinks
 *
 * Copyright (c) 2013 Jon Schlinkert, Brian Woodward, contributors.
 * Licensed under the MIT license.
 */

// Node.js
var path    = require('path');

// node_modules
var grunt   = require('grunt');
var _str    = require('underscore.string');
var _       = require('lodash');

// Assemble
var options = require('assemble').options;


// http://stackoverflow.com/a/10727155/1267639
// console.log(randomize('0A', 3));
// console.log(randomize('0aA', 9));
// console.log(randomize('0A!', 15));
exports.randomize = function (chars, length) {
  var mask = '';
  if (chars.indexOf('a') > -1) {
    mask += 'abcdefghijklmnopqrstuvwxyz';
  }
  if (chars.indexOf('A') > -1) {
    mask += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  }
  if (chars.indexOf('0') > -1) {
    mask += '0123456789';
  }
  if (chars.indexOf('!') > -1) {
    mask += '~!@#$%^&()_+-={}[];\',.';
  }
  var result = '';
  for (var i = length; i > 0; --i) {
    result += mask[Math.round(Math.random() * (mask.length - 1))];
  }
  return result;
};


/**
 * Normalize all slashes to be `/`
 * @param  {String} str
 * @return {String}
 */
exports.normalizePath = function(str) {
  return str.replace(/\\/g, '/');
};

/**
 * Check if the give file path ends with a slash.
 * @param  {String}  filePath
 * @return {Boolean}
 */
exports.endsWithSlash = function(filePath) {
  return _str.endsWith(path.normalize(filePath), path.sep);
};
var endsWithSlash = exports.endsWithSlash;

/**
 * Re-calculate the path from the src file to the given directory
 * defined in the assemble options, such as `assets`.
 * @param  {String} from Destination of the file.
 * @param  {String} to   Calculated "new" path.
 * @param  {String} origPath Stored original path to check against.
 * @return {String}
 */
exports.calculatePath = function(from, to, origPath) {
  var relativePath = path.relative(path.resolve(path.dirname(from)), path.resolve(to));
  to = exports.normalizePath(relativePath);

  if(!to || to.length === 0) {
    if(endsWithSlash(to)) {
      to = './';
    } else {
      to = '.';
    }
  }
  if(endsWithSlash(origPath) && !endsWithSlash(to)) {
    to += '/';
  } else if (!endsWithSlash(origPath) && endsWithSlash(to)) {
    to = to.substring(0, to.length - 2);
  }
  return to;
};