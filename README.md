# permalinks [![NPM version](https://badge.fury.io/js/permalinks.png)](http://badge.fury.io/js/permalinks) 

> Permalinks plugin for Assemble, the static site generator for Grunt.js, Yeoman and Node.js. This plugin enables powerful and configurable URI patterns, [Moment.js](http://momentjs.com/) for parsing dates, much more.

## Contributing
We welcome all kinds of contributions! The most basic way to show your support is to star the project, and if you'd like to get involed please see the [Contributing to permalinks](https://github.com/assemble/permalinks/blob/master/CONTRIBUTING.md) guide for information on contributing to this project.

## Quickstart

From the same directory as your project's [Gruntfile][Getting Started] and [package.json][], install this plugin with the following command:

```bash
npm install permalinks --save-dev
```

Once that's done, just add `permalinks`, the name of this module, to the `plugins` option in the Assemble task:

```js
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    assemble: {
      options: {
        plugins: ['permalinks'],
        permalinks: {
          structure: ':year/:month/:day/foo:/index.html'
        }
      },
      ...
    }
  });
  grunt.loadNpmTasks('assemble');
  grunt.registerTask('default', ['assemble']);
};
```

If everything was installed and configured correctly, you should be ready to go!

[grunt]: http://gruntjs.com/
[Getting Started]: https://github.com/gruntjs/grunt/blob/devel/docs/getting_started.md
[package.json]: https://npmjs.org/doc/json.html


## Patterns
### Permalink structure

> Replacement patterns for dynamically constructing permalinks, as well as the corresponding directory structures.

Permalinks are **appended to the dest directory**. So given this config:

```js
assemble: {
  blog: {
    options: {
      permalinks: {
        structure: ':year/:month/:day/:basename:ext'
      }
    },
    files: {
      'blog/archives/': ['archives/*.hbs']
    }
  }
}
// the generated directory structure and resulting path would look something like:
//=> 'blog/archives/2011/01/01/an-inspiring-post.html'
```

### How replacement patterns work

This plugin comes with a number of built-in replacement patterns that will automatically parse and convert the built-in variables into the appropriate string. Since Assemble provides a number of generic variables for accessing page data, such as `basename`, `ext`, `filename` etc., this plugin simply dynamically builds the replacement patterns from those generic variables.

Barring a few exceptions (`_page`, `data`, `filePair`, `page`, `pageName`), you should be able to use any _applicable_ variable that is on the page context in your replacement patterns.

For example, assuming we have a file, `./templates/overview.hbs`:

* `:ext`: would result in the `dest` extension: `.html`
* `:extname`: alias for `:ext`.
* `:basename`: would result in `overview`
* `:filename`: would result in the dest file name, `overview.html`
* `:pagename`: alias for `:filename`.
* `:category`: Slugified version of _the very first category_ for a page.


#### Custom replacement patterns

If you have some patterns you'd like to implement, if you think they're common enough that they should be built into this plugin, please submit a pull request.

Adding patterns is easy, just add a `patterns: []` property to the `permalinks` option, then add any number of patterns to the array. For example, let's say we want to add the `:project` variable to our permalinks:

```js
options: {
  permalinks: {
    structure: ':year/:month/:day/:project/:slug:ext',
    patterns: []
  }
}
...
```

Since `:project` is not a built-in variable, we need to add a replacement pattern so that any permalinks that include this variable will actually work:

```js
options: {
  permalinks: {
    structure: ':year/:month/:day/:project/:slug:ext',
    patterns: [
      {
        pattern: ':project',
        replacement: '<%= pkg.name %>'
      }
    ]
  }
}
...
```
#### with custom properties

Any string pattern is acceptable, as long as a `:` precedes the variable, but don't forget that there must also be a matching property in the context or Assemble will might an error (or worse, not). In other words, when you add a replacement pattern for `:foo`, it's good practice to make sure this property exists:

```yaml
---
foo: bar
slug:
---
```

### [Moment.js](http://momentjs.com/) date patterns

> This plugin uses the incredibly feature rich and flexible [moment.js](http://momentjs.com/) for parsing dates. If you have a feature request, please don't hesitate to create an issue or make a pull request.

For the date variables to work, a `date` property must exist on the page object.

```yaml
---
date: 2014-01-29 3:45 PM
---
```

Or

```js
pages: [
  {
    data: {
      title: 'All about permalinks, the novel.',
      description: 'This rivoting sequel to War & Peace will have you sleeping in no time.'
      date: '2014-01-29 3:45 PM'
    },
    content: ""
  }
]
```

#### Common date patterns

* `:year`: The year of the date, four digits, for example `2014`
* `:month`: Month of the year, for example `01`
* `:day`: Day of the month, for example `13`
* `:hour`: Hour of the day, for example `24`
* `:minute`: Minute of the hour, for example `01`
* `:second`: Second of the minute, for example `59`

For the following examples, let's assume we have a date in the YAML front matter of a page formatted like this:

```yaml
---
date: 2014-01-29 3:45 PM
---
```
(_note that this property doesn't have to be in YAML front matter, it just needs to be in the `page.data` object, so this works fine with `options.pages` collections as well._)

#### Full date
* `:date`:       Eqivelant to the full date: `YYYY-MM-DD`. Example: `2014-01-29`

#### Year
* `:YYYY`:      The full year of the date. Example: `2014`
* `:YY`:        The two-digit year of the date. Example: `14`
* `:year`:      alias for `YYYY`

#### Month name
* `:MMMM`:      The full name of the month. Example `January`.
* `:MMM`:       The name of the month. Example: `Jan`
* `:monthname`: alias for `MMMM`

#### Month number
* `:MM`:        The double-digit number of the month. Example: `01`
* `:M`:         The single-digit number of the month. Example: `1`
* `:month`:     alias for `MM`
* `:mo`:        alias for `M`

#### Day of the month
* `:day`:       alias for `DD`
* `:DD`:        The double-digit day of the month. Example: `29`
* `:D`:         The double-digit day of the month. Example: `29`

#### Day of the week
* `:dddd`:      Day of the week. Example: `monday`
* `:ddd`:       Day of the week. Example: `mon`
* `:dd`:        Day of the week. Example: `Mo`
* `:d`:         Day of the week. Example: `2`

#### Hour
* `:HH`:        The double-digit time of day on a 24 hour clock. Example `15`
* `:H`:         The single-digit time of day on a 24 hour clock. Example `3`
* `:hh`:        The double-digit time of day on a 12 hour clock. Example `03`
* `:h`:         The single-digit time of day on a 12 hour clock. Example `3`
* `:hour`:      alias for `HH`

#### Minute
* `:mm`:        Minutes. Example: `45`.
* `:m`:         Minutes. Example: `45`.
* `:min`:       Alias for `mm`|`m`.
* `:minute`:    Alias for `mm`|`m`.

#### Second
* `:ss`:        Seconds. Example: `09`.
* `:s`:         Seconds. Example: `9`.
* `:sec`:       Alias for `ss`|`s`.
* `:second`:    Alias for `ss`|`s`.



## Options
_Note that this plugin does not currently modify actual links inside pages, so that will need to be addressed separately. I'm also willing to look at options for incorporating that into this plugin._

### structure
Type: `String`
Default: `undefined`

The permalink pattern to use for building paths and generated files. Permalink structures are appended to the `dest` defined for the current target.

For example, let's say we use the following pattern on a few blog posts: `foo.hbs`,  `bar.hbs`, and `baz.hbs`:

```js
options: {
  permalinks: {
    structure: ':year/:month/:day/:basename:ext',
  },
  files: {
    './blog/': ['./templates/blog/*.hbs']
  }
}
// results in
// => './blog/2014/01/01/foo.html'
// => './blog/2014/01/01/bar.html'
// => './blog/2014/01/01/baz.html'
```

#### 'index' pages

Note that permalink structures will be ignored for files with the basename `index`. See [Issue #20](https://github.com/assemble/permalinks/issues/20) for more info.


### preset
Type: `String`
Default: `undefined`

The following presets are currently available:

* `pretty`: expands to `:basename/index:html`.
* `dayname`: expands to `:YYYY/:MM/:DD/:basename/index:ext`.
* `monthname`: expands to `:YYYY/:MM/:basename/index:ext`.

#### how presets work

In a nutshell, a preset is simply a pre-defined permalink `structure`, so instead of having to type out `:foo/:bar/:baz/basename:html`, you can just use `pretty`. Presets expand into permalink structures following this pattern:

```js
dest + preset
//=> dest + :bar/index:html
```

Additionally, if a `structure` is also defined, the `preset` will be appended to it.

```js
dest + structure + preset
//=> dest + :foo + :bar/index:html
```

_If you would like to see another preset, [please submit an issue](https://github.com/assemble/permalinks/issues/new)._


### dateFormats
Type: `Array`
Default: `["YYYY-MM-DD"]`

Array of custom date formats for [Moment.js](http://momentjs.com/) to use for parsing dates.

```js
options: {
  permalinks: {
    dateFormats: ["YYYY-MM-DD", "MM-DD-YYYY", "YYYY-MM-DDTHH:mm:ss.SSS"]
  },
  files: {
    ...
  }
}
```


### lang
Type: `String`
Default: `en`

Set the "global" language for [Moment.js](http://momentjs.com/) to use for converting dates:

```js
options: {
  permalinks: {
    structure: ':year/:month/:day/:basename:ext',
    lang: 'fr'
  }
  files: {
    'blog/': ['templates/blog/*.hbs']
  }
}
...
//=> blog/2013/mars/13/my-post.html
```


### exclusions
Type: `Array`
Default: `['_page', 'data', 'filePair', 'page', 'pageName']`

Properties to omit from the context for processing replacement patterns. I wanted to use this for omitting the default properties, but I decided to expose this as an option in case it comes in useful to someone else.

```js
options: {
  permalinks: {
    exclusions: ["foo", "bar"],
  },
  files: {
    ...
  }
}
```



## Usage Examples
### Pretty URLs

Pretty links involve saving an `index.html` to each directory, with the tile, file name, slug, or some other variable as the `:basename` of the directory. For example:

```js
assemble: {
  blog: {
    options: {
      permalinks: {
        structure: ':basename/:index.html'
      }
    },
    files: [
      {expand: true, cwd: 'templates/', src: ['*.hbs'], dest: 'blog/', ext: '.html'}
    ]
  }
}
```

which results in something like:

```
dest + /my-node-js-post/index.html
dest + /my-javascript-post/index.html
dest + /my-assemble-post/index.html
```


### Using presets

Presets allow you to achieve certain permalinks structures without having to explicitly define each URL segment. For example, in the previous example we created pretty URLs., Here is how we would do the same with `presets`:

```js
options: {
  permalinks: {
    preset: 'pretty'
  },
  files: {
    './blog/': ['./templates/blog/*.hbs']
  }
}
```

The above example won't necessarily save a whole lot of time, but it's a nice way of ensuring that you're getting pretty links with whatever permalinks structure you define. To some, this might be particularly useful when "stacked" with more complex permalink structures, e.g.:

```js
options: {
  permalinks: {
    preset: 'pretty',
    structure: ':archives/:categories',
  },
  files: {
    './blog/': ['./templates/blog/*.hbs']
  }
}
```

which expands to: `./blog/:archives/:categories/:basename:/index:ext`, and would result in:

```js
./blog/archives/categories/foo/index.html
```

### Dest extension

In most cases your generated HTML will have the `.html` extension, then using `:index.html` is probably fine. But if you happen to switch back and forthing between projects that alternate between `.htm` and `.html`, you can use `:index:ext` instead.


### Path separators

You don't have to use slashes (`/`) only in your permalinks, you can use `-` or `_` wherever you need them as well. For example, this is perfectly valid:

```
:YYYY_:MM-:DD/:slug:category:foo/:bar/index.html
```

**Warning**, this should be obvious, but make sure not to use a `.` in the middle of your paths, especially if you use Windows.

### Dynamically build slugs

You can even dynamically build up strings using Lo-Dash templates:

```yaml
---
date: 1-1-2014

## Dynamically build the slug for example
area: business
section: finance
slug: <%= area %>-<%= section %>
---
```
With this config:

```js
blog: {
  options: {
    permalinks: {
      structure: ':year/:month/:day/:slug/:title.html'
    }
  },
  files: {
    'blog/': ['posts/*.hbs']
  }
}
```

Would render to:

```
blog/2014/01/01/business-finance/index.html
```

### More examples

Keep in mind that the date is formatted the way you want it, you don't need to follow these examples. Also, some of these variables will only work if you add that property to your pages, and setup the replacement patterns.

```js
:YYYY/:MM/:DD/news/:id/index:ext
//=> dest + '/2014/01/01/news/001/index.html'

:YYYY/:MM/:DD/:mm/:ss/news/:id/index:ext
//=> dest + '/2014/01/01/40/16/news/001/index.html'

:year/:month/:day/:basename:ext
//=> dest + '/2014/01/01/my-post.html'

blog/:year-:month-:day/:basename:ext
//=> dest + 'blog/2014-01-01/my-post.html'

:date/:basename:ext
//=> dest + '2014-01-01/my-post.html'

:year/:month/:day/:category/index.html
//=> dest + '/2014/01/01/javascript/index.html'

:year/:month/:day/:slug/index.html
//=> dest + '/2014/01/01/business-finance/index.html'
```




## SEO
### Recommendations
Permalinks are important for SEO. but you should spend some time thinking about the strategy you want to use before you decide on a URL structure.


#### Avoid date-based permalinks
Yep, that's what I said. There are plenty of valid use cases for using date-based URL's. This plugin offers a number of date-based patterns, and we leverage [Moment.js][moment] a lot. Still,  I recommend that you avoid using a date-based permalink structure for your blog or documentation, because there is a good chance it will do more harm than good over the long term.

Date-based URL's tend to _decrease click through rates_ on older articles. Think about it, who prefers reading out of date content? So use a URL strategy that doesn't go out of its way to emphasize the date, and you'l keep your posts feeling like fresh content.


#### Numeric permalinks
Numeric or `:id` based permalinks are better than date-based, but they don't really offer much usability or SEO benefit.


#### Idiomatic permalinks
The best structure is one that:

* provides the _highest degree of semantic relevance_ to the content, and
* is _useful to both search engines and humans_

Here are some example permalink structures, pick the one you like or feel free to use something else:

```js
:author
:category/:author
```

Since the `:author` variable isn't actually built in, you'll need to add it as a custom replacement pattern. But you could use `:filename`, `:pagename`, `:basename` and so on. The important thing to remember is that _the name counts_.

If you need to use a custom variable, such as `:author` or `:title`, just add it like this:

```js
var _ = grunt.util._;

assemble: {
  options: {
    permalinks: {
      structure: ':author:ext',
      replacements: [
        {
          structure: ':author',
          replacement: '<%= _.slugify(pkg.author.name) %>'
        }
      ]
    }
  },
  files: {},
...
```

[moment]: http://momentjs.com/ "Moment.js Permalinks"


## Author

**Jon Schlinkert**

+ [github.com/jonschlinkert](https://github.com/jonschlinkert)
+ [twitter.com/jonschlinkert](http://twitter.com/jonschlinkert)

## Release History

 * 2013-10-09   v0.1.5   Adds logic to ignore permalink structures for files named "index". Fixes [issue 20](https://github.com/assemble/permalinks/issues/20). Updates replacement patterns to use RegExp and word boundaries to minimize potential for moment.js to greedily modify non-date patterns.
 * 2013-10-04   v0.1.2   Adds "presets" per [issue 6](https://github.com/assemble/permalinks/issues/6).
 * 2013-10-03   v0.1.1   Renames "pattern" to "structure".
 * 2013-10-03   v0.1.0   First commmit.

## License
Copyright (c) 2013 Jon Schlinkert, contributors.
Released under the MIT license

***

_This file was generated on Sunday, November 10, 2013._


[moment]: http://momentjs.com/ "Moment.js Permalinks"