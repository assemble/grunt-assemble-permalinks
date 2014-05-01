/**
 * Copyright (c) 2014 Jon Schlinkert
 * Licensed under the MIT License (MIT).
 */

'use strict';

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
    var ctx = _.omit(this, ['first', 'prev', 'next', 'last']);

    options = options || {};
    options.hash = options.hash || {};
    context = _.extend({modifier: ''}, context, ctx, options.hash);

    var template = [
      '<div class="list-group">',
      '  {{#eachItems pages}}',
      '  <a href="{{relative ../page.dest this.metadata.dest}}" class="list-group-item{{#is ../page.dest this.metadata.dest}} active{{/is}}">',
      '    {{default this.metadata.title this.metadata.basename}}',
      '  </a>',
      '  {{/eachItems}}',
      '</div>'
    ].join('\n');

    return new Handlebars.SafeString(Handlebars.compile(template)(context));
  };

  return helpers;

};
