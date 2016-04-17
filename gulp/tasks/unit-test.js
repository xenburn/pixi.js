var gulp = require('gulp'),
	electronMocha = require('gulp-electron-mocha').default;

gulp.task('unit-test', function() {
    gulp.src('./test', {read:false})
        .pipe(electronMocha({
            electronMocha: {
                renderer: true
            }
        }));
});