## Recommendations
Permalinks are important for SEO. but you should spend some time thinking about the strategy you want to use before you decide on a URL structure.


### Avoid date-based permalinks
Yep, that's what I said. There are plenty of valid use cases for using date-based URL's. This plugin offers a number of date-based patterns, and we leverage [Moment.js][moment] a lot. Still,  I recommend that you avoid using a date-based permalink structure for your blog or documentation, because there is a good chance it will do more harm than good over the long term.

Date-based URL's tend to _decrease click through rates_ on older articles. Think about it, who prefers reading out of date content? So use a URL strategy that doesn't go out of its way to emphasize the date, and you'l keep your posts feeling like fresh content.


### Numeric permalinks
Numeric or `:id` based permalinks are better than date-based, but they don't really offer much usability or SEO benefit.


### Idiomatic permalinks
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