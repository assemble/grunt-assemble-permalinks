---
title: My Blob Post
categories:
- popular
- recent
---

I have confirmed that this already works. You need to use `this.src`, since the context is available to the patterns, not just the `src`.

Here is an example, given you have a filename like `2014-03-27-test-blah-something.md`, you can create a function like this:

```js
var toPost = function(str) {
  var path = require('path');
  var name = path.basename(str, path.extname(str));
  var re = /(\d{4})-(\d{2})-(\d{2})-(.+)/;
  return name.replace(re, '$1/$2/$3/$4');
};
```

Then use it in the replacement patterns:

```js
options: {
  permalinks: {
    structure: ':year/:month/:day/index.html',
    patterns: [
      {
        pattern: ':year',
        replacement: function() {
          return toPost(this.src);
        }
      },
      {
        pattern: ':month',
        replacement: function() {
          return toPost(this.src);
        }
      },
      {
        pattern: ':day',
        replacement: function() {
          return toPost(this.src);
        }
      }
    ]
  }
}
```

Resulting in: `2014/03/27/test-blah-something/index.html`

I'm updating the docs for this.