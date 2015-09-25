/**
 * Copyright (c) 2014 Jon Schlinkert
 * Licensed under the MIT License (MIT).
 */
'use strict';

var relative = require('relative');

module.exports.register = function (Handlebars, options, params) {
  'use strict';

  /**
   * {{relative}}
   */
  exports.relative = function(from, to) {
    return relative(from, to);
  };

  for (var helper in exports) {
    if (exports.hasOwnProperty(helper)) {
      Handlebars.registerHelper(helper, exports[helper]);
    }
  }
};
