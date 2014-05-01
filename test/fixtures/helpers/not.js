/**
 * Copyright (c) 2014 Jon Schlinkert
 * Licensed under the MIT License (MIT).
 */
'use strict';

module.exports = function () {
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



