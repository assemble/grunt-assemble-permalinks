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


Here are some great permalink structures, pick the one you like or feel free to use something else, I just recommend you keep it simple:

```js
:postname
:category/:postname
```

Since the `:postname` variable isn't actually built in, you'll need to add it as a custom replacement pattern. But you could use `:filename`, `:pagename`, `:basename` and so one. The important takeaway here is that _the name counts_. Emphasize it.

And if you do decide to use a custom variable, like `:postname` or `:title`, just add it like this:

```js
options: {
  permalinks: {
    structure: ':postname:ext',
    replacements: [
      {
        pattern: ':postname',
        replacement: '<%= pkg.author.name %>'
      }
    ]
  }
}
...
```
