/**
 * Copyright (c) 2014 Jon Schlinkert
 * Licensed under the MIT License (MIT).
 */

// Node.js
var path   = require('path');
var fs     = require('fs');
var relative = require('relative');


// Export helpers
module.exports.register = function (Handlebars, options, params) {
  'use strict';

  /**
   * Calculate the relative path to the given file.
   */

  Handlebars.registerHelper("rel", function(context) {
    return relative(context, this.dest);
  });
};
