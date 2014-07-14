/*
 * grunt-cordova-setup
 * https://github.com/juzaun/grunt-cordova-setup
 *
 * Copyright (c) 2014 Justin Zaun
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function (grunt) {
  grunt.registerMultiTask('cordova_simulator', 'Run the current build in the simulator', function () {
    var done = this.async();

    // Merge task-specific and/or target-specific options with these defaults.
    var options = this.options({
      buildFolder: './build',
      platform: 'ios',
      device: 'iPhone (Retina 4-inch)',
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

    grunt.util.spawn({
      cmd: 'osascript',
      args: ['-e', 'tell app "iPhone Simulator" to quit']
    }, function () {

      // Launch the simulator
      grunt.util.spawn({
        cmd: options.cordovaPath + 'cordova',
        opts: {
          cwd: options.buildFolder
        },
        args: ['emulate', options.platform, '--target=' + options.device]
      }, function (error, result, code) {
        if (error) {
          grunt.fail.warn('cordova emulate failed: ' + error, code);
          done();
          return;
        } else {
          done();
        }
      });
    });
  });
};
