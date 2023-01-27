const gulp = require('gulp');
const del = require('del');

//for exports
const requireDiv = require('require-dir');
const tasks = requireDiv('./tasks');

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


function clean () {
    return del(['dist'])
}

//old exports
exports.hello = tasks.hello;
exports.style = tasks.style;

//new exports
exports.clean = clean
