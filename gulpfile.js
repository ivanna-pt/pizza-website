const gulp = require('gulp');
const del = require('del');

const requireDiv = require('require-dir');
const tasks = requireDiv('./tasks');

function clean () {
    return del(['dist'])
}

exports.hello = tasks.hello;
exports.style = tasks.style;
exports.clean = clean
