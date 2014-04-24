/**
 * Handlebars Helper: {{not}}
 * Copyright (c) 2013 Jon Schlinkert
 * Licensed under the MIT License (MIT).
 */

'use strict';


// Node.js
var path = require('path');
var fs   = require('fs');

// node_modules
var _ = require('lodash');

module.exports = function (config) {
  var helpers = {};
  /**
   * {{not}}
   */
  helpers.not = function (value, test, options) {
    if (value !== test) {
      return options.fn(this);
    } else {
      return options.inverse(this);
    }
  };

  return helpers;
};



