## Using presets

To simplify  might do something like:

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

Which, following the `dest + structure + preset` pattern, would result in:

```js
./blog/archives/categories/foo/index.html
```

## Path separators

You don't have to use slashes (`/`) only in your permalinks, you can use `-` or `_` wherever you need them as well. For example, this is perfectly valid:

```
:YYYY_:MM-:DD/:slug:category:foo/:bar/index.html
```

**Warning**, this should be obvious, but make sure not to use a `.` in the middle of your paths, especially if you use Windows.


## Pretty links

Pretty links involve saving an "index.html" to each directory, with the tile, file name or slug as the basename of the directory:

```js
assemble: {
  blog: {
    options: {
      permalinks: {
        structure: ':category/:slug/:index.html'
      }
    },
    files: [
      {expand: true, cwd: 'templates/', src: ['*.hbs'], dest: 'blog/', ext: '.html'}
    ]
  }
}
```

This would result in a directory structure that looks something like this:

```
/programming/my-node-js-post/index.html
/programming/my-javascript-post/index.html
/programming/my-assemble-post/index.html
```

## Dynamically build slugs

You can even dynamically build up strings using Lo-Dash templates:

```yaml
---
date: 1-1-2014

# Dynamically build the slug for example
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

## More examples

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

