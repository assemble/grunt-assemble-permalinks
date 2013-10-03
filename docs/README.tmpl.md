---
username: jonschlinkert
---
# {%= name %} [![NPM version](https://badge.fury.io/js/{%= name %}.png)](http://badge.fury.io/js/{%= name %}) {% if (travis) { %} [![Build Status]({%= travis %}.png)]({%= travis %}){% } %}

> {%= description %}

{% if (grunt.file.exists('EXAMPLES.md')) { %}[Also see examples →](./EXAMPLES.md){% } %}
## Quickstart
{%= _.doc("quickstart.md") %}

## Options
{%= _.doc("options.md") %}

## Usage Examples
{%= _.doc("examples.md") %}

## Contributing
Please see the [Contributing to {%= name %}]({%= homepage %}/blob/master/CONTRIBUTING.md) guide for information on contributing to this project.

{% if (changelog) { %}
## Release History
{%= _.include("docs-changelog.md") %} {% } else { %}
 * {%= grunt.template.today('yyyy') %}   v0.1.0   First commit
{% } %}

## Author

+ [github.com/{%= username %}](https://github.com/{%= username %})
+ [twitter.com/{%= username %}](http://twitter.com/{%= username %})

## License
{%= copyright %}
{%= license %}

***

_This file was generated on {%= grunt.template.today() %}._
