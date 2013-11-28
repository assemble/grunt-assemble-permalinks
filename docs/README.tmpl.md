---
username: jonschlinkert
---
# {%= name %} [![NPM version](https://badge.fury.io/js/{%= name %}.png)](http://badge.fury.io/js/{%= name %}) {% if (travis) { %} [![Build Status]({%= travis %}.png)]({%= travis %}){% } %}

> {%= description %}

{%= toc %}

Also see the [Gruntfile](./Gruntfile.js) for example usage.

## Contributing
We welcome all kinds of contributions! The most basic way to show your support is to star the project, and if you'd like to get involved please see the [Contributing to {%= name %}]({%= homepage %}/blob/master/CONTRIBUTING.md) guide for information on contributing to this project.

## Quickstart
{%= _.doc("quickstart.md") %}

## Patterns
{%= _.doc("patterns.md") %}

## Options
{%= _.doc("options.md") %}

## Usage Examples
{%= _.doc("examples.md") %}

## SEO
{%= _.doc("seo.md") %}

## Other Assemble plugins
Here are some other projects you might be interested in from the [Assemble](http://assemble.io) core team.
{% _.each(repos, function(repo) { %}
+ [{%= repo.name %}]({%= repo.url %}): {%= repo.description %} {% }); %}
Visit [assemble.io/plugins](http:/assemble.io/plugins/) for more information about [Assemble](http:/assemble.io/) plugins.

## Authors
{%= _.contrib("authors.md") %}

## License
{%= copyright %}
{%= license %}

***

{%= _.include("footer.md") %}
