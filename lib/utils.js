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
 * Calculate a three-digit number for each page
 * @param  {[type]} d [description]
 * @return {[type]}   [description]
 * @examples:
 *  1   => 001
 *  10  => 010
 *  100 => 100
 */
exports.pageNumber = function(d) {
  if (d < 100 && d > 9) {
    d = '0' + d.toString();
  }
  if (d < 10) {
    d = '00' + d.toString();
  }
  return d;
};

/**
 * Re-calculate the path from dest file to the given directory
 * defined in the assemble options, such as `assets`.
 * @param  {String} dest     Destination of the file.
 * @param  {String} toPath   Calculated "new" path.
 * @param  {String} origPath Stored original path to check against.
 * @return {String}
 */
exports.calculatePath = function(dest, toPath, origPath) {
  var relativePath = path.relative(path.resolve(path.dirname(dest)), path.resolve(toPath));
  toPath = exports.normalizePath(relativePath);

  if(!toPath || toPath.length === 0) {
    if(endsWithSlash(toPath)) {
      toPath = './';
    } else {
      toPath = '.';
    }
  }
  if(endsWithSlash(origPath) && !endsWithSlash(toPath)) {
    toPath += '/';
  } else if (!endsWithSlash(origPath) && endsWithSlash(toPath)) {
    toPath = toPath.substring(0, toPath.length - 2);
  }
  return toPath;
};