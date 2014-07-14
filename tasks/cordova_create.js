/*
 * grunt-cordova-setup
 * https://github.com/juzaun/grunt-cordova-setup
 *
 * Copyright (c) 2014 Justin Zaun
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function (grunt) {
  grunt.registerMultiTask('cordova_create', 'Script the creation of a cordova build', function () {
    var done = this.async();

    // Merge task-specific and/or target-specific options with these defaults.
    var options = this.options({
      buildFolder: './build',
      applicationId: '',
      applicationName: '',
      cordovaPath: __dirname + '/../node_modules/cordova/bin/'
    });

    // Make sure the paths have a trailing slash
    if (options.buildFolder.substr(-1) !== '/') {
      options.buildFolder += '/';
    }
    if (options.cordovaPath.length > 0 && options.cordovaPath.substr(-1) !== '/') {
      options.cordovaPath += '/';
    }

    if (grunt.file.exists(options.buildFolder)) {
      grunt.log.writeln('Build directory exists');
      done();
      return;
    }

    // Create the basic cordova template inside the build folder
    grunt.file.mkdir(options.buildFolder);
    grunt.util.spawn({
      cmd: options.cordovaPath + 'cordova',
      args: ['create', options.buildFolder, options.applicationId, options.applicationName]
    }, function (error, result, code) {
      if (error) {
        grunt.fail.warn('cordova create failed: ' + error, code);
        done();
        return;
      } else {

        // Remove the contents of the www folder
        grunt.file.delete(options.buildFolder + 'www');
        grunt.file.mkdir(options.buildFolder + 'www');

        done();
      }
    });
  });
};
