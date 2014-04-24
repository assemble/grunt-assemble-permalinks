
/**
 * Handlebars Helpers: {{relative}}
 * Copyright (c) 2013 Jon Schlinkert
 * Licensed under the MIT License (MIT).
 */

// Node.js
var path   = require('path');

// Export helpers
module.exports = function (config) {
  var helpers = {};

  /**
   * {{relative}}
   */
  helpers.relative = function(from, to) {
    var relativePath = path.relative(path.dirname(from), path.dirname(to));
    return path.join(relativePath, path.basename(to)).replace(/\\/g, '/');
  };

  return helpers;
};
