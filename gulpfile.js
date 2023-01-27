const gulp = require('gulp');

const del = require('del')
const browserSync = require('browser-sync').create();
const concat = require('gulp-concat');
const sourcemap = require('gulp-sourcemaps');

const sass = require('gulp-sass')(require('sass'));
const bulk = require('gulp-sass-bulk-importer');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');

const uglify = require('gulp-uglify');
const babel = require('gulp-babel');

const fileInclude = require('gulp-file-include');

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
    },
    html: {
        src: [
            'src/**/*.html', '!!src/components/**/*.html'
        ],
        dest: 'build'
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

//Build Javascript task
function scripts() {
    return gulp.src(path.scripts.src)
        .pipe(sourcemap.init())
        .pipe(babel())
        .pipe(uglify())
        .pipe(concat('main.min.js'))
        .pipe(sourcemap.write('../sourcemap/'))
        .pipe(gulp.dest(path.scripts.dest))

}

// Build HTML task
function htmlInclude () {
    return gulp.src(path.html.src)
        .pipe(fileInclude())
        .pipe(gulp.dest(path.html.dest))
    
}


//Watch changes
function watch () {
    gulp.watch(path.styles.src, styles)
    gulp.watch(path.scripts.src, scripts)
}

function browsersync() {
    browserSync.init({
        open: true,
        server: './build'
    });
}



//Clean dest 
function clean () {
    return del(['build'])
}

//old exports
// exports.hello = tasks.hello;
// exports.style = tasks.style;


//new exports
exports.clean = clean;
exports.styles = styles;
exports.scripts = scripts;
exports.watch = watch;
exports.htmlInclude = htmlInclude;



exports.default = gulp.series(
    gulp.parallel(clean),
    gulp.parallel(styles, scripts, htmlInclude),
    gulp.parallel(watch)
)
