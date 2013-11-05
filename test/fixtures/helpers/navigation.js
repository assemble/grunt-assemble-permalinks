/**
 * Handlebars Helpers: {{navigation}}
 * Copyright (c) 2013 Jon Schlinkert
 * Licensed under the MIT License (MIT).
 */

'use strict';

// Node.js
var path = require('path');
var fs = require('fs');


// Export helpers
module.exports.register = function (Handlebars, options, params) {

  var opts = options || {};
  var _ = params.grunt.util._;

  /**
   * {{navigation}}
   * Adds a navigation to enable navigating to prev and next page/post.
   * @param  {Object} context Context to pass to the helper, most likely `pagination`.
   * @param  {Object} options Pass a modifier class to the helper.
   * @return {String}         The navigation, HTML.
   */
  exports.navigation = function(context, options) {

    options = options || {};
    options.hash = options.hash || {};
    context = _.extend({modifier: ''}, context, opts.data, this, options.hash);

    var template = [
      '<div class="list-group">',
      '  {{#eachItems pages}}',
      '  <a href="{{relative ../page.dest this.dest}}" class="list-group-item{{#is ../page.dest this.dest}} active{{/is}}">',
      '    {{default title basename}}',
      '  </a>',
      '  {{/eachItems}}',
      '</div>'
    ].join('\n');

    return new Handlebars.SafeString(Handlebars.compile(template)(context));
  };

  for (var helper in exports) {
    if (exports.hasOwnProperty(helper)) {
      Handlebars.registerHelper(helper, exports[helper]);
    }
  }
};
