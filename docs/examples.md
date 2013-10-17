## Pretty URLs

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


## Using presets

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

## Dest extension

In most cases your generated HTML will have the `.html` extension, then using `:index.html` is probably fine. But if you happen to switch back and forthing between projects that alternate between `.htm` and `.html`, you can use `:index:ext` instead.


## Path separators

You don't have to use slashes (`/`) only in your permalinks, you can use `-` or `_` wherever you need them as well. For example, this is perfectly valid:

```
:YYYY_:MM-:DD/:slug:category:foo/:bar/index.html
```

**Warning**, this should be obvious, but make sure not to use a `.` in the middle of your paths, especially if you use Windows.

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

