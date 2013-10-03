
From the same directory as your project's [Gruntfile][Getting Started] and [package.json][], install this plugin with the following command:

```bash
npm install {%= name %} --save-dev
```

Once that's done, register the plugin with Assemble:

```js
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    assemble: {
      options: {
        plugins: ['permalinks']
      },
      blog: {
        options: {
          permalinks: {
            pattern: ':year/:month/:day/:name:ext'
          }
        },
        files: {
          'blog/': ['templates/posts/*.hbs']
        }
      }
    }
  });
  grunt.loadNpmTasks('assemble');
  grunt.registerTask('default', ['assemble']);
};
```

```js
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    assemble: {
      options: {
        plugins: ['permalinks', 'foo/*.js']
      },
      my_blog: {
        options: {
          permalinks: {
            pattern: ':year/:month/:day/:name:ext'
          }
        },
        files: {
          'blog/': ['templates/posts/*.hbs']
        }
      }
    }
  });
  grunt.loadNpmTasks('assemble');
  grunt.registerTask('default', ['assemble']);
};
```