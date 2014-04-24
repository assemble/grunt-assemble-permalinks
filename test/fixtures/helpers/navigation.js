/**
 * Handlebars Helpers: {{navigation}}
 * Copyright (c) 2013 Jon Schlinkert
 * Licensed under the MIT License (MIT).
 */

'use strict';

// Node.js
var path = require('path');
var fs = require('fs');
var _ = require('lodash');


module.exports = function (config) {
  var Handlebars = config.Handlebars;
  var helpers = {};

  /**
   * {{navigation}}
   * Adds a navigation to enable navigating to prev and next page/post.
   * @param  {Object} context Context to pass to the helper, most likely `pagination`.
   * @param  {Object} options Pass a modifier class to the helper.
   * @return {String}         The navigation, HTML.
   */
  helpers.navigation = function(context, options) {

    // get the current context
    var ctx = config.context();

    options = options || {};
    options.hash = options.hash || {};
    context = _.extend({modifier: ''}, context, ctx, this, options.hash);

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

  return helpers;

};
