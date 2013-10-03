```js
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    assemble: {
      options: {
        plugins: ['permalinks', 'foo/*.js']
      },
      permalinks: {
        options: {
          permalinks: {
            pattern: ':year/:month/:day/:name:ext'
            pattern: ':year/:month/:day/:slug/index.html'
          }
        },
        files: {
          'site/': ['templates/permalinks/*.hbs']
        }
      },
      permalinks2: {
        options: {
          permalinks: {
            // Separators can be any legal character: '', '/', '-', '_'
            pattern: ':YYYY_:MM-:DD/:slug/:category/:foo/index.html',
            replacements: [
              {
                pattern: ':foo',
                replacement: 'bar'
              }
            ]
          }
        },
        files: {
          'site/': ['templates/permalinks/*.hbs']
        }
      }
    }
  });
  grunt.loadNpmTasks('assemble');
  grunt.registerTask('default', ['assemble']);
};
```

```yaml
---
title: Snowshoe Crabs Are Swarthy and Devious
date: 02-13-2013
description: This is an example blog post.

# Dynamically build the slug with lodash templates
one: alpha
two: beta
three: gamma
slug: <%= one %>-<%= two %>-<%= three %>

categories:
  - node.js
---
<h1>{{{data.title}}}</h1>
<p>{{{description}}}</p>
```


