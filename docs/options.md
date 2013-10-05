_Note that this plugin does not currently modify actual links inside pages, so that will need to be addressed separately. I'm also willing to look at options for incorporating that into this plugin._

## structure
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

## preset
Type: `String`
Default: `undefined`

In a nutshell, a preset is a just a pre-defined permalink `structure`, so instead of having to type out `:foo/:bar/:baz/basename:html`, you can just use `pretty`. Since presets are simply pre-defined `structures`, they are also appended to the `dest`. For example:

```js
dest + preset
//=> dest + :basename/index:html
```

When a `structure` is also defined, the `preset` will be appended to it.

#### available presets
This is an experimental feature, so currently there is only one preset. I would be happy to add more with feedback:

* `pretty`: alias for `:basename/index:html`. So `foo.hbs` would be transformed to `foo/index.html`, which would render in the browser as: `/foo/`.


## dateFormats
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


## lang
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

## exclusions
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
