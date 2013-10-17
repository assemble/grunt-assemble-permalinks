/*
 * Assemble Plugin: Permalinks Utils
 * Assemble is the 100% JavaScript static site generator for Node.js, Grunt.js, and Yeoman.
 * https://github.com/assemble/permalinks
 *
 * Copyright (c) 2013 Jon Schlinkert, Brian Woodward, contributors.
 * Licensed under the MIT license.
 */

// Node.js
var path           = require('path');

// node_modules
var _              = require('grunt').util._;

// Assemble
var options        = require('assemble').options;
var originalAssets = options.originalAssets;



/**
 * Normalize all slashes to be `/`
 * @param  {String} str
 * @return {String}
 */
exports.normalizePath = function(str) {
  return str.replace(/\\/g, '/');
};



/**
 * Re-calculate the assets path from dest file to
 * the `assets` path defined in the assemble options.
 * @param  {String} dest
 * @param  {String} assets
 * @return {String}
 */
exports.calculateAssetsPath = function(dest, assets) {
  var newAssets   = assets;
  var destDirname = path.dirname(dest);

  var assetsWithSlash     = _.endsWith(path.normalize(newAssets), path.sep);
  var origAssetsWithSlash = _.endsWith(path.normalize(originalAssets), path.sep);

  newAssets = exports.normalizePath(path.relative(path.resolve(destDirname), path.resolve(newAssets)));

  if(!newAssets || newAssets.length === 0) {
    if(assetsWithSlash) {
      newAssets = './';
    } else {
      newAssets = '.';
    }
  }
  if(origAssetsWithSlash && !assetsWithSlash) {
    newAssets += '/';
  } else if (!origAssetsWithSlash && assetsWithSlash) {
    newAssets = newAssets.substring(0, newAssets.length - 2);
  }
  return newAssets;
};