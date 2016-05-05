var gulp = require('gulp'),
	floss = require('floss'),
    argv = require('yargs').argv;

gulp.task('test', function(done) {
    floss.run({
        path: './test/index.js',
        debug: !!argv.debug
    }, done);
});