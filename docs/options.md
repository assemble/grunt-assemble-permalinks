
* `:year`: The year of the date, four digits, for example `2014`
* `:month`: Month of the year, for example `01`
* `:day`: Day of the month, for example `13`
* `:hour`: Hour of the day, for example `24`
* `:minute`: Minute of the hour, for example `01`
* `:second`: Second of the minute, for example `59`
* `:ext`: The extension of the file, for example `.html`
* `:basename`: A sanitized "slugified" version of the title of the file. So `My Very first Post` becomes `my-very-first-post` in the URI.
* `:category`: A sanitized version of the very first category name.
* `:author`: A sanitized version of the author name from `package.json` or config settings.

Common patterns would be `:basename:ext`, `:basename/index.html`:


## YAML Front Matter

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


