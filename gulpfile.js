const gulp = require('gulp');

const del = require('del')
const bs = require('browser-sync');

const sass = require('gulp-sass')(require('sass'));
const bulk = require('gulp-sass-bulk-importer');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const concat = require('gulp-concat');
const sourcemap = require('gulp-sourcemaps');


//for old exports
const requireDiv = require('require-dir');
const tasks = requireDiv('./tasks');


//Paths
const path = {
    styles: {
        src: 'src/styles/**/*.scss',
        dest: 'build/css/'
    },
    scripts: {
        src: 'src/scripts/**/*.js',
        dest: 'build/js/'
    }
}

//Build Styles Task
function styles () {
    return gulp.src(path.styles.src)
        .pipe(sourcemap.init())
        .pipe(bulk())
        .pipe(sass({
            outputStyle: 'compressed'
        }).on('error', sass.logError))
        .pipe(autoprefixer({
            overrideBrowserslist: ['last 8 versions'],
            browsers: [
                'Android >= 4',
                'Chrome >= 20',
                'Firefox >= 24',
                'Explorer >= 11',
                'iOS >= 6',
                'Opera >= 12',
                'Safari >= 6',
            ]
        }))
        .pipe(cleanCSS({ level: 2}))
        .pipe(concat('style.min.css'))
        .pipe(sourcemap.write('../sourcemap/'))
        .pipe(gulp.dest(path.styles.dest))
}

function clean () {
    return del(['build'])
}

//old exports
// exports.hello = tasks.hello;
// exports.style = tasks.style;

//new exports
exports.clean = clean
exports.styles = styles

