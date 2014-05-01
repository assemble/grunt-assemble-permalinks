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
   * {{pager}}
   * Adds a pager to enable navigating to prev and next page/post.
   * @param  {Object} context Context to pass to the helper, most likely `pagination`.
   * @param  {Object} options Pass a modifier class to the helper.
   * @return {String}         The pager, HTML.
   */
  helpers.pager = function(context, options) {
    // get the current context
    var ctx = _.omit(this, ['first', 'prev', 'next', 'last']);

    options = options || {};
    options.hash = options.hash || {};
    context = _.extend({modifier: ''}, context, ctx, options.hash);

    var template = [
      '<ul class="nav nav-pills nav-stacked">',
      '',
      '  {{#is pagination.currentPage 1}}',
      '    <li class="prev disabled">',
      '      <a unselectable="on" class="unselectable">First</a>',
      '    </li>',
      '    <li class="prev disabled">',
      '      <a unselectable="on" class="unselectable">&larr; Previous</a>',
      '    </li>',
      '  {{/is}}',
      '',
      '  {{#not pagination.currentPage 1}}',
      '    <li class="prev">',
      '      <a href="{{relative page.dest first.dest}}">First</a>',
      '    </li>',
      '    <li class="prev">',
      '      <a href="{{relative page.dest prev.dest}}">&larr; Previous</a>',
      '    </li>',
      '  {{/not}}',
      '',
      '  {{#eachItems pages}}',
      '    <li{{#is ../page.dest this.dest}} class="active"{{/is}}>',
      '      <a href="{{relative ../page.dest this.dest}}">{{@number}}</a>',
      '    </li>',
      '  {{/eachItems}}',
      '',
      '  {{#not pagination.currentPage pagination.totalPages}}',
      '    <li class="next">',
      '      <a href="{{relative page.dest next.dest}}">Next &rarr;</a>',
      '    </li>',
      '    <li class="next">',
      '      <a href="{{relative page.dest last.dest}}">Last</a>',
      '    </li>',
      '  {{/not}}',
      '',
      '  {{#is pagination.currentPage pagination.totalPages}}',
      '    <li class="next disabled">',
      '      <a unselectable="on" class="unselectable">Next &rarr;</a>',
      '    </li>',
      '    <li class="next disabled">',
      '      <a unselectable="on" class="unselectable">Last</a>',
      '    </li>',
      '  {{/is}}',
      '',
      '</ul>'
    ].join('\n');

    return new Handlebars.SafeString(Handlebars.compile(template)(context));
  };

  return helpers;
};
