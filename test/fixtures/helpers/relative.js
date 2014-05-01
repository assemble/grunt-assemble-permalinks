/**
 * Copyright (c) 2014 Jon Schlinkert
 * Licensed under the MIT License (MIT).
 */
'use strict';

var relative = require('relative');

module.exports = function () {
  var helpers = {};

  helpers.relative = function(from, to) {
    return relative(from, to);
  };

  return helpers;
};
