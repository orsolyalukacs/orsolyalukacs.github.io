module.exports = {
    files: {
      javascripts: {
        joinTo: {
          'app.js': [/node_modules/, 'dev/js/app.js'],
          'admin.js': [/node_modules/, 'dev/js/admin.js'],
        },
  
      },
      stylesheets: {
        joinTo: {
          'app.css': ['dev/scss/style.scss'],
          'admin.css': ['dev/scss/admin.scss']
        }
      }
    },
    plugins: {
      postcss: {
        processors: [require('autoprefixer')(['last 8 versions'])]
      },
      sass: {
        options: {
          includePaths: ['node_modules']
        }
      },
      eslint: {
        config: {
          rules: {
            semi: 2,
            quotes: [2, "single"]
          },
        },
        pattern: /^src\/.*\.jsx?$/,
        warnOnly: false,
        formatter: 'table',
      },
      babel: {
        plugins: [
          ["transform-runtime"],
          ["transform-regenerator"],
        ],
        presets: [
          'es2015'
        ],
      }
    },
    modules: {
      autoRequire: {
        'app.js': ['dev/js/app.js'],
        'admin.js': ['dev/js/admin.js']
      },
    },
    paths: {
      watched: ['dev'],
      public: '../assets'
    }
  };
  