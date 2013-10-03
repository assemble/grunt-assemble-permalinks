# permalinks [![NPM version](https://badge.fury.io/js/permalinks.png)](http://badge.fury.io/js/permalinks) 

> Permalinks plugin for Assemble.


## Quickstart
```bash
npm i permalinks --save
```

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


## Options

* `:year`: The year of the date, four digits, for example `2014`
* `:month`: Month of the year, for example `01`
* `:monthnum`: Month of the year, for example `01`
* `:day`: Day of the month, for example `13`
* `:hour`: Hour of the day, for example `24`
* `:minute`: Minute of the hour, for example `01`
* `:second`: Second of the minute, for example `59`
* `:ext`: The extension of the file, for example `.html`
* `:basename`: A sanitized "slugified" version of the title of the file. So `My Very first Post` becomes `my-very-first-post` in the URI.
* `:category`: A sanitized version of the very first category name.
* `:author`: A sanitized version of the author name from `package.json` or config settings.

Common patterns would be `:basename:ext`, `:basename/index.html`:


### YAML Front Matter

```yaml
---
date: 1-1-2014
---
```
Renders to: `01-01-2014`.

```yaml
---
date: 2014-2-13
---
```
Renders to: `2014-02-13`.





## Usage Examples
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



## Contributing
Please see the [Contributing to permalinks](https://github.com/helpers/permalinks/blob/master/CONTRIBUTING.md) guide for information on contributing to this project.


 * 2013   v0.1.0   First commit


## Author

+ [github.com/jonschlinkert](https://github.com/jonschlinkert)
+ [twitter.com/jonschlinkert](http://twitter.com/jonschlinkert)

## License
Copyright (c) 2013 Jon Schlinkert, contributors.
Released under the MIT license

***

_This file was generated on Thu Oct 03 2013 05:23:09._
