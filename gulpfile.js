'use strict';

var gulp        = require('gulp')
   ,plumber     = require('gulp-plumber')
   ,sass        = require('gulp-sass')
   ,browserSync = require('browser-sync')
   ,uglify      = require('gulp-uglify')
   ,concat      = require('gulp-concat')
   ,imagemin    = require('gulp-imagemin')
   ,cp          = require('child_process');

var messages = {
	jekyllBuild: '<span style="color: green"> Jekyll Bolerplate is running: </span> $ jekyll build'
};

/* --- Build the Jekyll Site --- */

gulp.task('jekyll-build', function (done) {
	browserSync.notify(messages.jekyllBuild);
	return cp.spawn('jekyll', ['build'], {stdio: 'inherit'})
		.on('close', done);
});

/* --- Rebuild Jekyll & do page reload --- */

gulp.task('jekyll-rebuild', ['jekyll-build'], function () {
	browserSync.reload();
});

/* --- Wait for jekyll-build, then launch the Server --- */

gulp.task('browser-sync', ['jekyll-build'], function() {
	browserSync({
		server: {
			baseDir: '_site'
		}
	});
});

/*  --- Sass task --- */

gulp.task('sass', function(){
	gulp.src(['./assets/css/main.scss', './assets/css/partials/*.scss'])
	  .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
	  .pipe(gulp.dest('dist/css'))
    .pipe(browserSync.reload({stream:true}))
});

/* --- Javascript Task --- */

gulp.task('js', function(){
	return gulp.src('src/js/**/*.js')
		.pipe(plumber())
		.pipe(concat('main.js'))
		.pipe(uglify())
		.pipe(gulp.dest('dist/js/'))
});

/* --- Imagemin Task --- */

// gulp.task('imagemin', function() {
// 	return gulp.src('src/img/**/*.{jpg,png,gif}')
// 		.pipe(plumber())
// 		.pipe(imagemin({
//              optimizationLevel: 3
//             ,progressive: true
//             ,interlaced: true
//          }))
// 		.pipe(gulp.dest('dist/img/'));
// });

/* --- Watch stylus files for changes & recompile
 * --- Watch html/md files, run jekyll & reload BrowserSync
 */

gulp.task('watch', function () {
	gulp.watch('src/sass/**/*.sass', ['sass']);
	gulp.watch('src/js/**/*.js', ['js']);
	// gulp.watch('src/img/**/*.{jpg,png,gif}', ['imagemin']);
	gulp.watch(['*.html', '_includes/*.html', '_layouts/*.html', '_posts/*'], ['jekyll-rebuild']);
});

/* --- Default task, running just `gulp` will compile the sass,
 * --- compile the jekyll site, launch BrowserSync & watch files.
 */

gulp.task('default', ['js', 'sass', 'browser-sync', 'watch']);
