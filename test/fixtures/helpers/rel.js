/**
 * Handlebars Helpers: {{rel}}
 * Copyright (c) 2013 Jon Schlinkert
 * Licensed under the MIT License (MIT).
 */
'use strict';

// Node.js
var path   = require('path');
var fs     = require('fs');

// node_modules

// Export helpers
module.exports.register = function (Handlebars, options, params) {

  var assemble = params.assemble;
  var grunt    = params.grunt;
  var async    = grunt.util.async;
  var _        = grunt.util._;

  var opts     = options;

  var files    = assemble.files;

  // grunt.file.write('opts.json', JSON.stringify(opts, null, 2));
  // console.log(assemble.task.data.dest);
  // console.log(assemble.files);

  /**
   * {{rel}}
   */
  exports.rel = function(context) {
    context = _.extend(context, opts.data, this);
    // console.log(context.dest);
    // grunt.file.write('files.json', JSON.stringify(context, null, 2));

    // var files = assemble.files;
    // files.map(function (file, next) {
    //   grunt.log.writeln('dest:'.yellow, file.dest);
    // });

    var template = '{{relative context.dest dest}}';
    return new Handlebars.SafeString(Handlebars.compile(template)(context));
  };

  for (var helper in exports) {
    if (exports.hasOwnProperty(helper)) {
      Handlebars.registerHelper(helper, exports[helper]);
    }
  }
};
