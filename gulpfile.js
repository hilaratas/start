const gulp = require('gulp');
const watch = require('gulp-watch');
const plumber = require('gulp-plumber');
const del = require('del');
const browserSync = require('browser-sync');

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


const config = {
  src: {
    html: 'src/*.html',
    cssVendor: 'src/css/vendor/*.*',
    js: ['src/js/[^_]*.js', '!src/js/main.js', 'src/js/**/*.js', 'src/js/**/*.geojson'],
    sassCustom: 'src/css/style.scss',
    jsVendors: ['src/js/vendors/*.js'],
    jsPlugins: ['src/js/plugins/*.js'],
    svgSprite: 'src/media_design/svg-store/*.svg',
    svgDesign: 'src/media_design/**/*.svg',
    svgExample: 'src/media_example/**/*.svg',
    imgSprite: 'src/media_design/img-stoge/*.png',
    imgDesign: 'src/media_design/**/*.{png,jpg,gif}',
    imgExample: 'src/media_example/**/*.{png,jpg,gif}',
    iconfont: 'src/fonts/iconfont-store/*.svg',
    fonts: 'src/fonts/**/*.*',
  },
  
  build: {
    html: 'build/',
    js: 'build/js/',
    sassCustom: 'build/css/',
    svgSprite: 'build/media_design/',
    svgDesign: 'build/media_design/',
    svgExample: 'build/media_example/',
    imgSprite: 'build/sprites/',
    imgSpriteCss: 'build/css/',
    imgDesign: 'build/media_design/',  
    imgExample: 'build/media_example/',
    iconfont: 'build/fonts/',
    fonts: 'build/fonts/'
  },

  watch: {
    html: 'src/*.html',
    js: 'src/js/**/*.js'
  },

  clean: './build', //директории которые могут очищаться
  server: './build' //исходная корневая директория для запуска минисервера
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

gulp.task('html', () => gulp.src(config.src.html).pipe(gulp.dest(config.build.html)) );

gulp.task('sassCustom', function() {
  return gulp.src(config.src.sassCustom)
    .pipe(plumber())
    .pipe(sass())
    .pipe(autoprefixer({
      browsers: ['last 4 versions']
    }))
    .pipe(mmq())
    .pipe(rename('style.css'))
    .pipe(gulp.dest(config.build.sassCustom));
});

gulp.task('jsVendors', () => gulp.src(config.src.jsVendors).pipe(gulp.dest(config.build.js)) );

gulp.task('jsPlugins', () => gulp.src(config.src.jsPlugins).pipe(gulp.dest(config.build.js)) );

gulp.task('jsCustom', function(callback) {
  let firstBuildReady = false;

  function done(err, stats) {
    firstBuildReady = true;
    if (err) { return;  /* emit('error', err) in webpack-stream*/ }
  }

  return gulp.src('src/js/main.js')
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
    browserSync.init({ server: "./build" });

    gulp.watch("./build/**/*.html, ./build/**/*.js").on('change', browserSync.reload);

    browserSync.watch("./build/**/*.css", function (event, file) {
      if (event === "change") {
          browserSync.reload("*.css");
      }
  });
});

build = gulp.series('del', 'html', 'jsPlugins', 'jsVendors', 'jsCustom', 'svgSprite', 'svgDesign', 'svgExample', 'imgDesign', 'imgExample', 'iconFonts', 'fonts', 'sassCustom');

gulp.task('default', build);
gulp.task('dev', gulp.series(build, watch));