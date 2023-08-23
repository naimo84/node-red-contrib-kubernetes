const gulp = require("gulp");
const ts = require("gulp-typescript");

const sourcemaps = require('gulp-sourcemaps');
const nodemon = require('gulp-nodemon');
const watch = require('gulp-watch');
const minify = require('gulp-minify');
const replace = require('gulp-replace');

const fs = require('fs')
const paths = {
    pages: ['src/*.html'],
    src: 'src',
    dist: 'dist'
};



gulp.task('develop', function (done) {
    const stream = nodemon({
        legacyWatch: true,
        exec: 'node --inspect=9229 --preserve-symlinks      --experimental-modules       --trace-warnings     ' + (process.env.NODE_RED_JS ? process.env.NODE_RED_JS : '/usr/lib/node_modules/node-red/red.js'),
        ext: '*.js',
        watch: [paths.dist],
        ignore: ["*.map"],
        done: done,
        verbose: true,
        delay: 2000,
        env: { "NO_UPDATE_NOTIFIER": "1" }
    });
  
 
    

    watch(paths.src).on('change', () => {

   
        stream.emit('restart', 10)
    });

   
   
    stream
        .on('restart', function () {
            console.log('restarted!')
        })
        .on('crash', function () {
            console.error('Application has crashed!\n')
            stream.emit('restart', 10)  // restart the server in 10 seconds
        })
})

