const gulp = require('gulp');
const watch = require('gulp-watch');
const plumber = require('gulp-plumber');
const del = require('del');

const fileinclude = require('gulp-file-include'),
  prettify = require('gulp-jsbeautifier');

// sass plugins
const sass = require('gulp-sass'),
  autoprefixer = require('gulp-autoprefixer'),
  mmq = require('gulp-merge-media-queries');

// js plugins
const webpackStream  = require('webpack-stream'),
  webpack = webpackStream.webpack,
  source = require('vinyl-source-stream'),
  buffer = require('vinyl-buffer'),
  named = require('vinyl-named'),
  uglify = require('gulp-uglify'),
  browserify = require('browserify'),
  babel = require('babelify'),
  path = require('path');

// media plugins
const svgmin = require('gulp-svgmin'),
  svgstore = require('gulp-svgstore'),
  rename = require('gulp-rename'),
  imagemin = require('gulp-imagemin'),
  pngquant = require('imagemin-pngquant');


// iconFonts plugins
const iconfont = require('gulp-iconfont'),
    iconfontCss = require('gulp-iconfont-css');

// server plugins
const browserSync = require('browser-sync');
const server = browserSync.create();


const config = {
  src: {
    html: 'src/*.html',
    cssCopy: 'src/css/**/*.css',
    sassCustom: 'src/scss/style.scss',
    bootstrap: 'src/scss/bootstrap4.scss',
    bootstrapGrid: 'src/scss/bootstrap4-grid.scss',
    cssVendor: 'src/scss/vendor/*.*', 
    jsVendors: 'src/js/vendors/*.js',
    jsPlugins: 'src/js/plugins/*.js',
    jsCustom: 'src/js/main.js',
    svgSprite: 'src/media/svg-store/*.svg',
    svgDesign: 'src/media/**/*.svg',
    svgExample: 'src/example/**/*.svg',
    imgSprite: 'src/media/img-stoge/*.png',
    imgDesign: 'src/media/**/*.{png,jpg,gif}',
    imgExample: 'src/example/**/*.{png,jpg,gif}',
    iconfont: 'src/fonts/iconfont-store/*.svg',
    fonts: 'src/fonts/**/*.*',
  },
  
  build: {
    html: 'build/',
    cssCopy: 'build/css',
    js: 'build/js/',
    jsVendors: 'build/js/vendors/',
    jsPlugins: 'build/js/plugins/',
    css: 'build/css/',
    svgSprite: 'build/media/', 
    svgDesign: 'build/media/',
    svgExample: 'build/example/',
    imgSprite: 'build/sprites/',
    imgSpriteCss: 'build/css/',
    imgDesign: 'build/media/',  
    imgExample: 'build/example/',
    iconfont: 'build/fonts/',
    fonts: 'build/fonts/'
  },

  watch: {
    html: ['src/**/*.html'],
    cssCopy: 'src/css/**/*.css',
    cssCustom: ['src/scss/style.scss', 'src/scss/_variables_components.scss', 'src/scss/components/**/*.scss'],
    bootstrap: ['src/scss/bootstrap4.scss', 'src/scss/_variables_bootstrap4.scss', 'src/scss/bootstrap4/**/*/css'],
    bootstrapGrid: ['src/scss/bootstrap4-grid.scss', 'src/scss/_variables_bootstrap.scss', 'src/scss/bootstrap/**/*/css'],
    jsVendors: ['src/js/vendors/*.js'],
    jsPlugins: ['src/js/plugins/*.js'],
    jsCustom:  ['src/js/main.js', 'src/js/components/**/*.js'],
    js: 'src/js/**/*.js'
  },

  clean: './build', //директории которые могут очищаться
  server: 'build'  //исходная корневая директория для запуска минисервера
};

const webpackConfig = {
  context: path.join(__dirname, 'src/js'),
  entry: './main',
  output: {
    path: path.join(__dirname, 'build/js'),
    filename: 'main.js'
  },
  watch: false,
  plugins: [
  ],
  module: {
    loaders: [{
        test:    /\.js$/,
        exclude: /(node_modules|bower_components)/,
        include: path.join(__dirname, "frontend"),
        loader:  'babel?presets[]=es2015'
      }]
  }
};

const runTimestamp = Math.round(Date.now()/1000);
const customfontName = 'Iconfont';

gulp.task('del', () => del(config.clean) );

gulp.task('html', function() {

    return gulp.src(config.src.html)
    .pipe(plumber())
    .pipe(prettify())
    .pipe(fileinclude({
      prefix: '@@'
    }))
    .pipe(prettify())
    .pipe(gulp.dest(config.build.html));
});

gulp.task('cssCopy', function(){
  return gulp.src(config.src.cssCopy)
    .pipe(plumber())
    .pipe(gulp.dest(config.build.cssCopy));
});

gulp.task('bootstrap4', () => { return gulp.src(config.src.bootstrap).pipe(plumber())
    .pipe(sass()).pipe(autoprefixer({ browsers: ['last 4 versions'] }))
    .pipe(mmq()).pipe(rename('bootstrap4.css'))
    .pipe(gulp.dest(config.build.css)); });

gulp.task('bootstrap4Grid', () => { return gulp.src(config.src.bootstrapGrid).pipe(plumber())
    .pipe(sass()).pipe(autoprefixer({ browsers: ['last 4 versions'] }))
    .pipe(mmq()).pipe(rename('bootstrap4-grid.css'))
    .pipe(gulp.dest(config.build.css)); });

gulp.task('cssCustom', function() {
  return gulp.src(config.src.sassCustom)
    .pipe(plumber())
    .pipe(sass())
    .pipe(autoprefixer({
      browsers: ['last 4 versions']
    }))
    .pipe(mmq())
    .pipe(rename('style.css'))
    .pipe(gulp.dest(config.build.css));
});

gulp.task('jsVendors', () => { return gulp.src(config.src.jsVendors).pipe(gulp.dest(config.build.jsVendors)) });

gulp.task('jsPlugins', () => { return gulp.src(config.src.jsPlugins).pipe(gulp.dest(config.build.jsPlugins)) });

gulp.task('jsCustom', function(callback) {
  let firstBuildReady = false;

  function done(err, stats) {
    firstBuildReady = true;
    if (err) { return;  /* emit('error', err) in webpack-stream*/ }
  }

  return gulp.src(config.src.jsCustom)
      .pipe(plumber())
      .pipe(named())
      .pipe(webpackStream(webpackConfig, null, done))
      .pipe(gulp.dest(config.build.js))
      .on('data', function() {
        if (firstBuildReady) {
          callback();
        }
      });
});

gulp.task('svgSprite', () =>  { return gulp.src(config.src.svgSprite).pipe(svgmin({ plugins: [{removeTitle: true}]}))
    .pipe(rename({ prefix: 'icon-' })).pipe(svgstore({ inlineSvg: true }))
    .pipe(rename('svg-sprite.svg')).pipe(gulp.dest(config.build.svgSprite)); });

gulp.task('svgDesign', () => gulp.src(config.src.svgDesign).pipe(svgmin()).pipe(gulp.dest(config.build.svgDesign)) );

gulp.task('svgExample', () => gulp.src(config.src.svgExample).pipe(svgmin()).pipe(gulp.dest(config.build.svgExample)) );

gulp.task('imgDesign', () => { 
    let imageminCfg = { progressive: true, removeViewBox: false, use: [pngquant()] };
    return gulp.src(config.src.imgDesign).pipe(plumber())
      .pipe(imagemin(imageminCfg)).pipe(gulp.dest(config.build.imgDesign));
});

gulp.task('imgExample', function() {
  let imageminCfg = { progressive: true, removeViewBox: false, use: [pngquant()] };
  return gulp.src(config.src.imgExample).pipe(plumber())
    .pipe(imagemin(imageminCfg)).pipe(gulp.dest(config.build.imgExample));
});

gulp.task('iconFonts', function(){
  return gulp.src(config.src.iconfont)
    .pipe(iconfontCss({
      fontName: customfontName,
      path: 'src/css/components/custom_mixins/_icons.scss',
      targetPath: customfontName.toLowerCase() + '.scss',
      cssClass: 'iconfont'
    }))
    .pipe(iconfont({
      fontName: customfontName,
      timestamp: runTimestamp,
      formats: ['eot', 'woff', 'woff2', 'svg', 'ttf']
    }))
    .pipe(gulp.dest('src/tmp/' + customfontName));
});

gulp.task('fonts', () => gulp.src([config.src.fonts, 'src/tmp/' + customfontName + '/*.{woff,woff2}']).pipe(gulp.dest(config.build.fonts)) );


gulp.task('serve', function() {
  server.init({ server: config.server });
});

function reload(done) {
  server.reload();
  done();
}

gulp.task('watch', function(){
  gulp.watch(config.watch.html, gulp.series('html'));
  gulp.watch(config.watch.jsPlugins, gulp.series('jsPlugins', reload));
  gulp.watch(config.watch.jsVendors, gulp.series('jsVendors', reload));
  gulp.watch(config.watch.jsCustom, gulp.series('jsCustom', reload));
  gulp.watch(config.src.svgSprite, gulp.series('svgSprite', reload));
  gulp.watch(config.src.svgDesign, gulp.series('svgDesign', reload));
  gulp.watch(config.src.svgExample, gulp.series('svgExample', reload));
  gulp.watch(config.src.imgDesign, gulp.series('imgDesign', reload));
  gulp.watch(config.src.imgExample, gulp.series('imgExample', reload));
  gulp.watch(config.watch.bootstrap, gulp.series('bootstrap4', reload));
  gulp.watch(config.watch.bootstrapGrid, gulp.series('bootstrap4Grid', reload));
  gulp.watch(config.watch.cssCopy, gulp.series('cssCopy', reload));
  gulp.watch(config.watch.cssCustom, gulp.series('cssCustom', reload));
});

build = gulp.series('del', 'html', 'jsPlugins', 'jsVendors', 'jsCustom', 'svgSprite', 'svgDesign', 'svgExample', 'imgDesign', 'imgExample', 'fonts', 'cssCopy', 'bootstrap4', 'bootstrap4Grid', 'cssCustom');

gulp.task('default', build);
gulp.task('dev', gulp.series(build, gulp.parallel('serve', 'watch')));
gulp.task('prod', gulp.series(build, 'serve'));