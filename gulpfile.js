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

const newer = require('gulp-newer');
const imagemin = require('gulp-imagemin');
const imageminJpegRecomp = require('imagemin-jpeg-recompress');
const pngquant = require('imagemin-pngquant');
const webp = require('gulp-webp');
const multiDest = require('gulp-multi-dest');


//for old exports
// const requireDiv = require('require-dir');
// const tasks = requireDiv('./tasks');


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
            'src/**/*.html', '!src/components/**/*.html', '!src/fonts/**/*.html'
        ],
        dest: 'build',
        watch: ['src/**/*.html', '!src/fonts/**/*.html']
    },
    images: {
        src: 'src/img/**/*.*',
        dest: "build/img"
    },
    fonts: {
        src: 'src/fonts/**/',
        dest: 'build/fonts'
    }
}

//Build Styles Task
function styles () {
    return gulp.src([path.styles.src, path.fonts.src + '*.scss'])
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
        .pipe(browserSync.stream())
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
        .pipe(browserSync.stream())
}

// Build HTML task
function htmlInclude () {
    return gulp.src(path.html.src)
        .pipe(fileInclude({
            prefix: '@@',
            basepath: '@file'
        }))
        .pipe(gulp.dest(path.html.dest))
        .pipe(browserSync.stream())
}

//Build Images task
function imgMin () {
    return gulp.src(path.images.src)
        .pipe(newer(path.images.dest))
        // .pipe(imagemin())
        .pipe(imagemin([
            imageminJpegRecomp({
                progressive: true,
                min: 70, max: 75
            }),

            pngquant({
                speed: 5,
                quality: [0.6, 0.8]
            }),

            imagemin.svgo({
                plugins: [
                    { removeViewBox: false },
                    { removeUnusedNS: false },
                    { removeUselessStrokeAndFill: false },
                    { cleanupIDs: false },
                    { removeComments: true },
                    { removeEmptyAttrs: true },
                    { removeEmptyText: true },
                    { collapseGroups: true }
                ]
            })
        ]))
        .pipe(gulp.dest(path.images.dest))
}

function webpConverter () {
    return gulp.src('build/img/**/*.{png,jpg,jpeg}')
        // .pipe(newer(path.images.dest))
        .pipe(webp())
        .pipe(gulp.dest(path.images.dest))
}

const image = gulp.series(imgMin, webpConverter, (done) => {browserSync.reload(); done();});

//Move Flaticon task
function moveFlaticon() {
    return gulp.src('src/fonts/flaticon/*.*')
        .pipe(gulp.dest('build/fonts/flaticon'))
}




//Watch changes
function watch () {
    gulp.watch(path.styles.src, styles)
    gulp.watch(path.scripts.src, scripts)
    gulp.watch(path.html.watch, htmlInclude)
    gulp.watch(path.images.src, image)
}

function browsersync() {
    browserSync.init({
        open: true,
        server: './build'
    });
}



//Clean dest 
function clean () {
    return del(['build/*', '!build/img'])
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
exports.image = image;
exports.moveFlaticon = moveFlaticon;



exports.default = gulp.series(
    gulp.parallel(clean),
    gulp.parallel(styles, scripts, htmlInclude, image, moveFlaticon),
    gulp.parallel(browsersync, watch)
)
