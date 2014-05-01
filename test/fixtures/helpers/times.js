/**
 * Handlebars Helpers: {{times}}
 * Copyright (c) 2013 Jon Schlinkert
 * Licensed under the MIT License (MIT).
 */

'use strict';

// Node.js
var path = require('path');
var fs = require('fs');


// Export helpers
module.exports = function (config) {
  var Handlebars = config.Handlebars;
  var helpers = {};

  /**
   * {{times}}
   */
  helpers.times = function(value, options) {
    var data, i, content = "";

    for (i = 1; i <= value; i++) {
      if (options.data) {
        data = Handlebars.createFrame(options.data || {});
        data.index = i;
      }
      content = content + options.fn(this, { data: data });
    }
    return content;
  };

  return helpers;
};

