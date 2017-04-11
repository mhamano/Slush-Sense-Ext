/*
 * slush-sense-ext
 * https://github.com/mhamano/slush-sense-ext
 *
 * Copyright (c) 2016, Masaki Hamano
 * Licensed under the MIT license.
 */

'use strict';

var gulp = require('gulp'),
    install = require('gulp-install'),
    conflict = require('gulp-conflict'),
    template = require('gulp-template'),
    rename = require('gulp-rename'),
    _ = require('underscore.string'),
    inquirer = require('inquirer'),
    path = require('path');

function format(string) {
    var username = string.toLowerCase();
    return username.replace(/\s/g, '');
}

var defaults = (function () {
    var workingDirName = path.basename(process.cwd()),
      homeDir, osUserName, configFile, user;

    if (process.platform === 'win32') {
        homeDir = process.env.USERPROFILE;
        osUserName = process.env.USERNAME || path.basename(homeDir).toLowerCase();
    }
    else {
        homeDir = process.env.HOME || process.env.HOMEPATH;
        osUserName = homeDir && homeDir.split('/').pop() || 'root';
    }

    configFile = path.join(homeDir, '.gitconfig');
    user = {};

    if (require('fs').existsSync(configFile)) {
        user = require('iniparser').parseSync(configFile).user;
    }

    return {
        extensionName: workingDirName,
        userName: osUserName || format(user.name || ''),
        authorName: user.name || '',
        authorEmail: user.email || '',
        homeDir: homeDir.replace('\\','/')
    };
})();

gulp.task('default', function (done) {
    var prompts = [{
        name: 'extensionName',
        message: 'What is the name of the extension?',
        default: defaults.extensionName
    }, {
        name: 'extensionDescription',
        message: 'What is the description?'
    }, {
        name: 'extensionVersion',
        message: 'What is the version of your extension?',
        default: '0.1.0'
    }, {
        name: 'authorName',
        message: 'What is the author name?',
        default: defaults.authorName
    }, {
        name: 'userName',
        message: 'What is the github username?',
        default: defaults.userName
    }, {
        type: 'confirm',
        name: 'moveon',
        message: 'Continue?'
    }];
    //Ask
    inquirer.prompt(prompts,
        function (answers) {
            if (!answers.moveon) {
                return done();
            }
            answers.extensionNameSlug = _.slugify(answers.extensionName);
            answers.extensionNameWithoutDash = answers.extensionNameSlug.replace('-', '');
            answers.osUserName = defaults.userName;
            answers.homeDir = defaults.homeDir;

            gulp.src(__dirname + '/templates/src/extension.png')
            .pipe(rename(function (file) {
                var splitted_filename = file.basename.split(".");
                if (splitted_filename[0] == 'extension') {
                  file.basename = answers.extensionNameSlug
                }
                // if (file.basename[0] === '_') {
                //     file.basename = '.' + file.basename.slice(1);
                // }
            }))
            .pipe(conflict('./src/'))
            .pipe(gulp.dest('./src/'))
            .pipe(install());

            gulp.src([__dirname + '/templates/**','!' + __dirname + '/templates/src/extension.png'])
                .pipe(template(answers))
                .pipe(rename(function (file) {
                    var splitted_filename = file.basename.split(".");
                    if (splitted_filename[0] == 'extension') {
                      file.basename = answers.extensionNameSlug
                    }
                    if (file.basename[0] === '_' && file.basename != '_root') {
                        file.basename = '.' + file.basename.slice(1);
                    }
                }))
                .pipe(conflict('./'))
                .pipe(gulp.dest('./'))
                .pipe(install())
                .on('end', function () {
                    done();
                });
        });
});
