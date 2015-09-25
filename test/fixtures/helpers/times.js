/**
 * Handlebars Helpers: {{times}}
 * Copyright (c) 2013 Jon Schlinkert
 * Licensed under the MIT License (MIT).
 */

'use strict';

// Export helpers
module.exports.register = function (Handlebars) {

  /**
   * {{times}}
   */
  exports.times = function(value, options) {
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

  for (var helper in exports) {
    if (exports.hasOwnProperty(helper)) {
      Handlebars.registerHelper(helper, exports[helper]);
    }
  }
};

