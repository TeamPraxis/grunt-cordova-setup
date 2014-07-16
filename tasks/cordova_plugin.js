/*
 * grunt-cordova-setup
 * https://github.com/juzaun/grunt-cordova-setup
 *
 * Copyright (c) 2014 Justin Zaun
 * Licensed under the MIT license.
 */

'use strict';

var async = require('async');

module.exports = function (grunt) {
  grunt.registerMultiTask('cordova_plugin', 'Add plugins', function () {
    var done = this.async();

    // Merge task-specific and/or target-specific options with these defaults.
    var options = this.options({
      buildFolder: './build',
      cordovaPath: __dirname + '/../node_modules/cordova/bin/',
      plugins: []
    });

    // Make sure the paths have a trailing slash
    if (options.buildFolder.substr(-1) !== '/') {
      options.buildFolder += '/';
    }

    if (!grunt.file.exists(options.buildFolder)) {
      grunt.log.writeln('cordova build directory does not exist');
      done();
      return;
    }

    grunt.log.writeln('Installing Cordova plugins:');
    async.eachSeries(options.plugins, function (pluginID, nextPlugin) {
      var folder = pluginID, url = pluginID;
      if (typeof(pluginID) === 'object') {
        folder = pluginID.name;
        url = pluginID.url;
      }
      if (!grunt.file.exists(options.buildFolder + 'plugins/' + folder)) {
        grunt.log.writeln('  ' + folder);
        grunt.util.spawn({
          cmd: options.cordovaPath + 'cordova',
          opts: {
            cwd: options.buildFolder
          },
          args: ['plugin', 'add', url]
        }, function (error, result, code) {
          if (error) {
            grunt.fail.warn('Cordova plugin install failed: ' + error, code);
            nextPlugin('error');
            return;
          } else {
            nextPlugin();
          }
        });
      } else {
        grunt.log.writeln('  ' + folder + ' (skipped)');
        nextPlugin();
      }
    }, function () {
      grunt.log.writeln('Finished installing Cordova plugins');
      done();
    });
  });
};
