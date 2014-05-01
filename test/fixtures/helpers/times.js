/**
 * Copyright (c) 2014 Jon Schlinkert
 * Licensed under the MIT License (MIT).
 */

'use strict';

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

