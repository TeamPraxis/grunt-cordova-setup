/*
 * grunt-cordova-setup
 * https://github.com/juzaun/grunt-cordova-setup
 *
 * Copyright (c) 2014 Justin Zaun
 * Licensed under the MIT license.
 */

'use strict';

var spawn = require('child_process').spawn,
    byline = require('byline');

module.exports = function (grunt) {
  grunt.registerMultiTask('cordova_device', 'Run the current build on a device', function () {
    var done = this.async();

    // Merge task-specific and/or target-specific options with these defaults.
    var options = this.options({
      buildFolder: './build',
      platform: 'ios',
      cordovaPath: __dirname + '/../node_modules/cordova/bin/'
    });

    // Make sure the paths have a trailing slash
    if (options.buildFolder.substr(-1) !== '/') {
      options.buildFolder += '/';
    }
    if (options.cordovaPath.length > 0 && options.cordovaPath.substr(-1) !== '/') {
      options.cordovaPath += '/';
    }

    if (!grunt.file.exists(options.buildFolder)) {
      grunt.log.writeln('cordova build directory does not exist');
      done();
      return;
    }

    grunt.log.writeln('Starting cordova...');
    var cordova = spawn(options.cordovaPath + 'cordova', ['run', options.platform, '--device'], {
      cwd: options.buildFolder
    });

    byline(cordova.stdout).on('data', function (data) {
      grunt.log.writeln(data.toString());
      if (data && data.toString().indexOf('Finished load') > -1) {
        setTimeout(function () {
          cordova.kill('SIGKILL');
          done();
        }, 2000);
      }
    });

    setTimeout(function () {
      grunt.log.writeln('User is taking to long... Killing it.');
      cordova.kill('SIGKILL');
      done();
    }, 90000);
  });
};
