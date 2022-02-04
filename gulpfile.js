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

function copyIcons() {
  
    return gulp.src('src/icons/*', { base: 'src/icons/' })      
        .pipe(gulp.dest('dist/icons'));
}

function copyHtml() {
  
    return gulp.src('src/*.html', { base: 'src/' })      
        .pipe(gulp.dest(paths.dist));
}

gulp.task("copy-html", copyHtml);
gulp.task("copy-icons", copyIcons);


gulp.task('develop', function (done) {
    const stream = nodemon({
        legacyWatch: true,
        exec: 'node --inspect=9229 --preserve-symlinks      --experimental-modules       --trace-warnings     /usr/lib/node_modules/node-red/red.js',
        ext: '*.js',
        watch: [paths.dist],
        ignore: ["*.map"],
        done: done,
        verbose: true,
        delay: 2000,
        env: { "NO_UPDATE_NOTIFIER": "1" }
    });

  
    copyHtml();
    const tsProject = ts.createProject("tsconfig.json");
  

    tsProject.src()
        .pipe(sourcemaps.init())
        .pipe(tsProject())
        .js
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(paths.dist));

    watch(paths.pages).on('change', () => {

        copyHtml();
        stream.emit('restart', 10)
    });

    watch('src/resources/*.html').on('change', () => {

        copyHtml();
        stream.emit('restart', 10)
    });

    watch('src/**/*.ts').on('change', () => {
        gulp.series( () => {
            tsProject.src()
                .pipe(sourcemaps.init())
                .pipe(tsProject())
                .js
                .pipe(sourcemaps.write('.'))
                .pipe(gulp.dest(paths.dist));
        })
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

gulp.task("default",
    gulp.parallel('copy-html','copy-icons',
        () => {
            const tsProject = ts.createProject("tsconfig.json");
            return tsProject.src()
                .pipe(tsProject())
                .js
                .pipe(minify({
                    ext: {
                        min: '.js' // Set the file extension for minified files to just .js
                    },
                    noSource: true // Don’t output a copy of the source file
                }))
                .pipe(gulp.dest(paths.dist));
        })
);
