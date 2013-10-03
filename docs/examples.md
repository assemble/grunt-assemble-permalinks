## Path separators

You don't have to use slashes (`/`) only in your permalinks, you can use `-` or `_` wherever you need them as well. For example, this is perfectly valid:

```
pattern: ':YYYY_:MM-:DD/:slug:category:foo/:bar/index.html'
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
      pattern: ':year/:month/:day/:slug/:title.html'
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

```js
:year/:month/:day/:basename:ext
//=> dest + '/2014/01/01/my-post.html'

:year/:month/:day/:category/index.html
//=> dest + '/2014/01/01/javascript/index.html'

:year/:month/:day/:slug/index.html
//=> dest + '/2014/01/01/business-finance/index.html'
```

