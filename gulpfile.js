const gulp = require('gulp');

const requireDiv = require('require-dir');
const tasks = requireDiv('./tasks');

exports.hello = tasks.hello;


