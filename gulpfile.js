var	gulp = require('gulp'),
    watch = require('gulp-watch'),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    rename = require('gulp-rename'),
    sourcemaps = require('gulp-sourcemaps'),
    spritesmith = require('gulp.spritesmith'),
    imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant'),
    notify = require('gulp-notify'),
    ftp = require('gulp-ftp'),
    sftp = require('gulp-sftp'),
    plumber = require('gulp-plumber'),
    svgmin = require('gulp-svgmin'),
    svgstore = require('gulp-svgstore'),
    fileinclude = require('gulp-file-include'),
    cheerio = require('gulp-cheerio'),
    inject = require('gulp-inject'),
    del = require('del'),
    babel = require('babelify'),
    uglify = require('gulp-uglify'),
    source = require('vinyl-source-stream'),
    buffer = require('vinyl-buffer'),
    browserify = require('browserify'),
    browserSync = require('browser-sync'),
    reload      = browserSync.reload,
    cleanCSS = require('gulp-clean-css'),
    cmq = require('gulp-combine-media-queries'),
    rimraf = require('rimraf'), //очистка
    mmq = require('gulp-merge-media-queries'),
    prettify = require('gulp-jsbeautifier'),
    iconfont = require('gulp-iconfont'),
    iconfontCss = require('gulp-iconfont-css'),
    sq = require('gulp-sequence'),
    run = require('run-sequence').use(gulp),
    zip = require('gulp-zip');

var path = {
	src: { //Пути откуда брать исходники
        html: 'src/*.html', //Синтаксис src/template/*.html говорит gulp что мы хотим взять все файлы с расширением .html
        js: ['src/js/[^_]*.js', 'src/js/**/*.js', 'src/js/**/*.geojson'], //В стилях и скриптах нам понадобятся только main файлы
        jshint: 'src/js/*.js',
        css: 'src/sass/style.scss',
        cssVendor: 'src/css/vendor/*.*', //Если мы хотим файлы библиотек отдельно хранить то раскоментить строчку
        svgSprite: 'src/sprites/svg-store/*.svg',
		imgSprite: 'src/sprites/img/*.png',
        imgDesign: 'src/img/**/*.{png,jpg,gif}',
        svgDesign: 'src/img/**/*.svg',
		imgExample: 'src/media_example/**/*.{png,jpg,gif}', //Синтаксис img/**/*.* означает - взять все файлы всех расширений из папки и из вложенных каталогов      
        svgExample: 'src/media_example/**/*.svg',
		fonts: 'src/fonts/**/*.*',
        htaccess: 'src/.htaccess',
		video: 'src/media_example/**/*.{mp4}', 
		ajax: 'src/ajax/*',
		iconfont: 'src/fonts/iconfont-store/*.svg',
    },
	
  
    build: { //Тут мы укажем куда складывать готовые после сборки файлы
        html: 'build/',
        js: 'build/js/',
        css: 'build/css/',
		svgSprite: 'build/sprites/',
		imgSprite: 'build/sprites/',
        imgSpriteCss: 'build/css/',
        imgDesign: 'build/img/',
        svgDesign: 'build/img/',
        imgExample: 'build/media_example/',
		svgExample: 'build/media_example/',
        fonts: 'build/fonts/',
        htaccess: 'build/',
		video: 'build/media_example',
		iconfont: 'build/fonts/'
    },
    
    watch: { //Тут мы укажем, за изменением каких файлов мы хотим наблюдать
        html: 'src/*.html',
        js: 'src/js/**/*.js',
        css: 'src/css/**/*.*',
        img: 'src/css/images/**/*.*',
        fonts: 'src/fonts/**/*.*',
        htaccess: 'src/.htaccess',
        sprites: 'src/css/sprites/*.png'
    },
    clean: './build', //директории которые могут очищаться
	cleanTmp: './src/tmp',
    outputDir: './build' //исходная корневая директория для запуска минисервера
};

var runTimestamp = Math.round(Date.now()/1000);
var customfontName = 'Iconfont';

gulp.task('clean', function () {
    del([path.clean, 'src/tmp']);
});

gulp.task('sync', function() {
   browserSync.init({
      server: './build'
   });
   browserSync.watch('./build/**/*').on('change', browserSync.reload);
});

gulp.task('scripts', function() {
	var bundler = browserify('src/js/main.js', { debug: true }).transform(babel);
	bundler
		.bundle()
		.on('error', function(err) { console.error(err); this.emit('end'); })
		.pipe(source('main.js'))
		.pipe(buffer())
		.pipe(uglify())
		.pipe(gulp.dest('build/js/'));
});

gulp.task('html', function() {
   gulp.src(path.src.html)
   .pipe(fileinclude({
      prefix: '@@'
   }))
	 .pipe(prettify())
   .pipe(gulp.dest(path.build.html));
});

gulp.task('iconFont', function(){

	gulp.src(path.src.iconfont).
		pipe(iconfontCss({
		  fontName: customfontName,
		  path: 'src/sass/components/custom_mixins/_icons.scss',
		  targetPath: customfontName.toLowerCase() + '.scss',
      cssClass: 'iconfont'
		})).
    pipe(iconfont({
			fontName: customfontName,
			timestamp: runTimestamp,
			formats: ['eot', 'woff', 'woff2', 'svg', 'ttf']
		}))
		.pipe(gulp.dest('src/tmp/' + customfontName));	
	
	// gulp.src('src/tmp/' + customfontName + '/*.{woff, woff2, svg, eot}')
	// 	.pipe(gulp.dest('build/fonts/'));
	
});


gulp.task('sass', function() {
   gulp.src('src/sass/style.scss')
      .pipe(plumber())
      .pipe(sass())
	    .pipe(autoprefixer({
        browsers: ['last 4 versions']
	   }))
	  .pipe(mmq())
      .pipe(rename('style.css'))
      .pipe(gulp.dest(path.build.css));
});


gulp.task('bootstrap', function() {
   gulp.src(['src/sass/bootstrap.scss', 'src/sass/_variables.scss'])
      .pipe(plumber())
      .pipe(sass())
	    .pipe(autoprefixer({
        browsers: ['last 4 versions']
	   }))
	  .pipe(mmq())
      .pipe(rename('bootstrap.css'))
      .pipe(gulp.dest(path.build.css));
});

gulp.task('svgSprite', function () {
    gulp.src(path.src.svgSprite)
      .pipe(svgmin({
          plugins: [{
              removeTitle: true
          }]
      }))
      .pipe(rename({ prefix: 'icon-' }))
      .pipe(svgstore({ inlineSvg: true }))
      .pipe(rename('svg-store.svg'))
      .pipe(gulp.dest(path.build.svgSprite));
});

gulp.task('imgSprite', function() {
   var spriteData = gulp.src(path.src.imgSprite)
   .pipe(spritesmith({
      imgName: 'sprite.png',
      cssName: 'sprite.scss',
      algorithm: 'top-down',
      padding: 5
   }));
   // Pipe image stream through image optimizer and onto disk
   var imgStream = spriteData.img
      .pipe(gulp.dest(path.build.imgSprite));

  // Pipe CSS stream through CSS optimizer and onto disk
   var cssStream = spriteData.css
      .pipe(gulp.dest(path.build.imgSpriteCss));
});

gulp.task('svgDesign', function() {
   gulp.src(path.src.svgDesign)
      .pipe(svgmin())
      .pipe(gulp.dest(path.build.svgDesign));
});

gulp.task('imgDesign', function() {
   gulp.src(path.src.imgDesign)
        .pipe(plumber())
      .pipe(imagemin({
         progressive: true,
         removeViewBox: false,
         use: [pngquant()]
       }))
      .pipe(gulp.dest(path.build.imgDesign));
});

gulp.task('svgExample', function() {
   gulp.src(path.src.svgExample)
      .pipe(svgmin())
      .pipe(gulp.dest(path.build.svgExample));
});

gulp.task('imgExample', function() {
   gulp.src(path.src.imgExample)
       .pipe(plumber())
      .pipe(imagemin({
         progressive: true,
         removeViewBox: false,
         use: [pngquant()]
       }))
      .pipe(gulp.dest(path.build.imgExample));
});

gulp.task('svgExample', function() {
   gulp.src(path.src.svgExample)
      .pipe(svgmin())
      .pipe(gulp.dest(path.build.svgExample));
});

gulp.task('fonts', function() {
   gulp.src([path.src.fonts, 'src/tmp/' + customfontName + '/*.{woff,woff2}'])
      .pipe(gulp.dest(path.build.fonts));
});

gulp.task('video', function() {
   gulp.src(path.src.video)
      .pipe(gulp.dest(path.build.video));
});

gulp.task('ajax', function() {
   gulp.src(path.src.ajax)
      .pipe(gulp.dest('./build/ajax/'));
});

gulp.task('js', function() {
   gulp.src(path.src.js)
      .pipe(gulp.dest(path.build.js));
});

gulp.task('serve', function() {
    browserSync.init({
         server: "./build"
    });

    // gulp.watch("app/scss/*.scss", ['sass']);
    // gulp.watch("./build/**/*.*").on('change', browserSync.reload);
});

gulp.task('zip', function(){
  gulp.src(['build', 'src', 'gulpfile.js', 'package.json', 'README.md'])
    .pipe(zip('html.zip'))
    .pipe(gulp.dest('./'));
});

gulp.task('sftp', function(){
  gulp.src(['./html.zip', './build/**/*'] )
    .pipe(sftp({
      host: 'zkh2.u265.morizolabs.ru',
      user: 'zkh2',
      pass: 'zkh2_zkh2'
    }));
});





gulp.task('watch', function(){
   watch(['./src/*.html', './src/html_include/*.html'], function() {
      gulp.start('html');
   });
   
   watch(['./src/sass/**/*.scss'], function() {
      gulp.start('sass');
   });
   
   watch(['./src/sprites/svg-store/**/*.svg'], function() {
      gulp.start('svgSprite');
   });
   watch(['./src/sprites/img/*.{png,jpg,gif}'], function() {
      gulp.start('imgSprite');
   });
   watch(['src/img/**/*.svg'], function() {
      gulp.start('svgDesign');
   });
   watch(['src/img/**/*.{png,jpg,gif}'], function() {
      gulp.start('imgDesign');
   });
   watch(['src/media_example/**/*.svg'], function() {
      gulp.start('svgExample');
   });
   watch(['src/media_example/**/*.{png,jpg,gif}'], function() {
      gulp.start('imgExample');
   });
   watch(['./src/fonts/*'], function() {
      gulp.start('fonts');
   });
   watch(['./src/video/*'], function() {
      gulp.start('video');
   });
   watch(['./src/ajax/*'], function() {
      gulp.start('ajax');
   });
   watch(['./src/js/main.js', './src/js/components/**/*.js'], function() {
      gulp.start('scripts');
   });
   watch(['./src/js/**/*.js', './src/js/**/*.geojson' ], function() {
      gulp.start('js');
   });
   watch(['./src/ajax/*'], function() {
      gulp.start('ajax');
   });   
   /*watch(['src/fonts/iconfont-store/*.svg'], function() {
	   sq('iconfont', 'sass');
   });*/
});

gulp.task('default', ['html', 'sass', 'bootstrap', 'svgSprite', 'imgSprite', 'svgDesign', 'imgDesign', 'svgExample', 'imgExample', 'fonts',  'js', 'scripts', 'video', 'ajax', 'watch']);
gulp.task('build', sq('html', 'svgSprite', 'imgSprite', 'svgDesign', 'imgDesign', 'svgExample', 'imgExample', 'bootstrap', 'fonts', 'js', 'scripts', 'video', 'ajax', 'sass'));
gulp.task('dev', ['watch', 'serve']);