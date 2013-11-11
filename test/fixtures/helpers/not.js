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


// Export helpers
module.exports.register = function (Handlebars, options, params) {
  var _ = params.grunt.util._;

  /**
   * {{not}}
   */
  exports.not = function (value, test, options) {
    if (value !== test) {
      return options.fn(this);
    } else {
      return options.inverse(this);
    }
  };


  for (var helper in exports) {
    if (exports.hasOwnProperty(helper)) {
      Handlebars.registerHelper(helper, exports[helper]);
    }
  }
};



