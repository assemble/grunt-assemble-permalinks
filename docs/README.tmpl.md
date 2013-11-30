---
username: jonschlinkert
---
# {%= name %} [![NPM version](https://badge.fury.io/js/{%= name %}.png)](http://badge.fury.io/js/{%= name %}) {% if (travis) { %} [![Build Status]({%= travis %}.png)]({%= travis %}){% } %}

> {%= description %}

## Table of Contents
{%= toc %}

Also see the [Gruntfile](./Gruntfile.js) for example usage.

## Contributing
{%= _.contrib("contributing.md") %}

## Quickstart
{%= _.doc("quickstart.md") %}


## The "permalinks" plugin
### Patterns
{%= _.doc("patterns.md") %}

### Options
{%= _.doc("options.md") %}

### Usage Examples
{%= _.doc("examples.md") %}

### SEO
{%= _.doc("seo.md") %}


## Other Assemble plugins
{%= _.include("related-repos-list.md") %}

## Authors
{%= _.contrib("authors.md") %}

## License
{%= copyright %}
{%= license %}

***

{%= _.include("footer.md") %}