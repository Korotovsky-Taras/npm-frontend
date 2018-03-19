// Requiring All Plugins
const gulp = require('gulp')
const babel = require('gulp-babel')
const rollup = require('gulp-better-rollup')
const eslint = require('gulp-eslint')
const uglify = require('gulp-uglify')
const sass = require('gulp-sass')
const plumber = require('gulp-plumber')
const autoprefixer = require('gulp-autoprefixer')
const groupcss = require('gulp-group-css-media-queries')
const csso = require('gulp-csso')
const csscomb = require('gulp-csscomb')
const rework = require('gulp-rework')
const reworkNpm = require('rework-npm')
const includer = require('gulp-swig');
const iconfont = require('gulp-iconfont');
const iconfontCss = require('gulp-iconfont-css');
const rename = require('gulp-rename')
const browserSync = require('browser-sync').create()
const imagemin = require('gulp-imagemin')
const size = require('gulp-size')

const fontName = 'svg-fonts';

// Live Server
gulp.task('server', () => {
  browserSync.init({
    server: './build',
  })
  gulp.watch('build/*.html').on('change', browserSync.reload)
  gulp.watch('build/css/*.css').on('change', browserSync.reload)
  gulp.watch('build/js/*.js').on('change', browserSync.reload)
  gulp.watch('build/img/*').on('change', browserSync.reload)
})

gulp.task('iconfont', () => {
  gulp.src(['src/iconfont/svg/*.svg'])
    .pipe(iconfontCss({
      fontName,
      path: 'src/iconfont/template.scss',
      targetPath: '../../src/sass/_icons.scss',
      fontPath: '../fonts/',
    }))
    .pipe(iconfont({
      fontName,
      formats: ['ttf', 'eot', 'woff', 'woff2'],
      // prependUnicode: true,
      normalize: true,
      fontHeight: 1001,
    }))
    .pipe(gulp.dest('build/fonts/'));
});

gulp.task('swig', () => {
  gulp.src(['src/swig/*.html'])
    .pipe(includer({ defaults: { cache: false } }))
    .pipe(gulp.dest('build/'))
});

// Compile scss to css
gulp.task('scss', () => {
  gulp.src('src/sass/style.scss')
    .pipe(plumber())
    .pipe(sass())
    .pipe(autoprefixer())
    .pipe(groupcss())
    .pipe(csscomb())
    .pipe(size())
    .pipe(plumber.stop())
    .pipe(gulp.dest('build/css/'))
})

// Add npm css modules to the css file
gulp.task('modules', () => {
  gulp.src('src/sass/_vendor.scss')
    .pipe(plumber())
    .pipe(rework(reworkNpm()))
    .pipe(rename('_modules.scss'))
    .pipe(plumber.stop())
    .pipe(gulp.dest('src/sass/'))
})

// Minify CSS
gulp.task('minifycss', () => {
  gulp.src('build/css/style.css')
    .pipe(plumber())
    .pipe(csso())
    .pipe(rename({ suffix: '.min' }))
    .pipe(size())
    .pipe(plumber.stop())
    .pipe(gulp.dest('build/css/'))
})

// Compile ES6 to ES5
gulp.task('babel', ['eslint'], () => {
  gulp.src('src/babel/script.js')
    .pipe(plumber())
    .pipe(rollup({ format: 'cjs' }))
    .pipe(babel())
    .pipe(size())
    .pipe(plumber.stop())
    .pipe(gulp.dest('build/js/'))
})

// Lint JS Files
gulp.task('eslint', () => {
  gulp.src('src/babel/*.js')
    .pipe(eslint())
    .pipe(eslint.format())
})

// Minify JS Files
gulp.task('minifyjs', () => {
  gulp.src('build/js/script.js')
    .pipe(plumber())
    .pipe(uglify())
    .pipe(rename({ suffix: '.min' }))
    .pipe(size())
    .pipe(plumber.stop())
    .pipe(gulp.dest('build/js/'))
})

// Minify Images
gulp.task('imagemin', () => {
  gulp.src('src/img/*')
    .pipe(plumber())
    .pipe(imagemin())
    .pipe(size())
    .pipe(plumber.stop())
    .pipe(gulp.dest('build/img/'))
})

// Move Font Awesome font files to build/fonts
gulp.task('fonts', () => {
  gulp.src('node_modules/font-awesome/fonts/*')
    .pipe(size())
    .pipe(gulp.dest('build/fonts/'))
})

// Watch Files for changes
gulp.task('watch', () => {
  gulp.watch('src/babel/*.js', ['babel'])
  gulp.watch(['src/sass/*.scss', '!src/sass/_vendor.scss'], ['scss'])
  gulp.watch('src/sass/slices/*.scss', ['scss'])
  gulp.watch('src/swig/*.html', ['swig'])
  gulp.watch('src/img/*', ['imagemin'])
  gulp.watch('src/sass/_vendor.scss', ['modules'])
  gulp.watch('src/svg/*.svg', ['iconfont'])
})

// Build Task
gulp.task('build',
  [
    'swig',
    'iconfont',
    'sass',
    'modules',
    'babel',
    'imagemin',
    'minifyjs',
    'minifycss',
    'fonts',
  ])

// Default/Development Task
gulp.task('default',
  [
    'swig',
    'iconfont',
    'modules',
    'scss',
    'babel',
    'imagemin',
    'fonts',
    'watch',
    'server',
  ])
