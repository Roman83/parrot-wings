const gulp = require('gulp');
const browserify = require('browserify');
const babelify = require('babelify');
const watch = require('gulp-watch');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const eslint = require('gulp-eslint');
const uglify = require('gulp-uglify');
const concat = require('gulp-concat');
const browserSync = require('browser-sync');
const source = require('vinyl-source-stream');
const htmlmin = require('gulp-htmlmin');
const buffer = require('vinyl-buffer');
const image = require('gulp-image');

gulp.task('sass', () => {
  gulp.src('./src/scss/main.scss')
    .pipe(sass.sync().on('error', sass.logError))
    .pipe(autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
    }))
    .pipe(concat('style.css'))
    .pipe(gulp.dest('./build'))
    .pipe(browserSync.reload({stream: true}));
});

gulp.task('js-lint', () => {
  gulp.src('./src/**.js')
    .pipe(eslint())
    .pipe(eslint.format());
});

gulp.task('js-build', () => {
  return browserify({
    entries: './src/script.js',
    debug: true,
    extensions: ['es6'],
    transform: [babelify.configure({
      presets: ["es2015"]
    })]
  })
    .bundle()
    .pipe(source('index.js'))
    .pipe(gulp.dest('./build/'))
    .pipe(browserSync.reload({stream: true}));
});

gulp.task('browser-sync', () => {
  browserSync({
    server: {baseDir: './build/'},
    port: 8080,
    open: true
  });
});

gulp.task('html', () => {
  gulp.src(['./src/**/*.html'])
    .pipe(gulp.dest('./build'))
    .pipe(browserSync.reload({stream: true}));
});

gulp.task('watch', () => {
  gulp.watch('./src/**/*.js', ['js-lint', 'js-build']);
  gulp.watch('./src/scss/**/*.scss', ['sass']);
  gulp.watch('./**/*.html', ['html']);
  gulp.watch('./src/img/*.*', ['img']);
  gulp.watch('./src/fonts/*.*', ['fonts']);
});

gulp.task('img', function () {
  gulp.src('./src/img/*')
    .pipe(image())
    .pipe(gulp.dest('./build/img'))
    .pipe(browserSync.reload({stream: true}));;
});

gulp.task('fonts', function() {
  return gulp.src('src/fonts/**/*')
    .pipe(gulp.dest('build/fonts'))
    .pipe(browserSync.reload({stream: true}));;
});

gulp.task('default',
          ['js-lint', 'js-build', 'sass', 'html', 'img', 'fonts',
           'watch', 'browser-sync']);

gulp.task('sass-dist', () => {
  gulp.src('./src/scss/main.scss')
    .pipe(sass.sync().on('error', sass.logError))
    .pipe(autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
    }))
    .pipe(cleanCSS({compatibility: 'ie8'}))
    .pipe(concat('style.css'))
    .pipe(gulp.dest('./dist'));
});

gulp.task('js-dist', () => {
  return browserify({
    entries: './src/script.js',
    debug: false,
    extensions: ['es6'],
    transform: [babelify.configure({
      presets: ["es2015"]
    })]
  })
    .bundle()
    .pipe(source('index.js'))
    .pipe(buffer())
    .pipe(uglify())
    .pipe(gulp.dest('./dist/'));
});

gulp.task('html-dist', () => {
  gulp.src(['./src/**/*.html'])
    .pipe(htmlmin({
      collapseWhitespace: true,
      removeComments: true
    }))
    .pipe(gulp.dest('./dist'));
});

gulp.task('img-dist', function () {
  gulp.src('./src/img/*')
    .pipe(image())
    .pipe(gulp.dest('./dist/img'));
});

gulp.task('fonts-dist', function() {
  return gulp.src('src/fonts/**/*')
    .pipe(gulp.dest('dist/fonts'));
});

gulp.task('dist', ['js-dist', 'sass-dist', 'html-dist', 'img-dist', 'fonts-dist']);
